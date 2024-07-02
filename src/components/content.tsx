import React, { useRef, useState ,useEffect} from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { authState, loggedUserState } from "../UiState";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars,faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRecoilValue } from "recoil";
import { useResetRecoilState } from 'recoil';
import axios from "axios";


interface LocationState {
  email_id: string;
}
const Content: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location as { state: LocationState };
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const token = localStorage.getItem('accessToken');
  const currency = localStorage.getItem('currency');
  const userdetails = useRecoilValue(loggedUserState);
  const firstLetter = userdetails.name.charAt(0).toUpperCase();
  const resetLoggedUser = useResetRecoilState(loggedUserState);
  const userDetailsRef = useRef<HTMLDivElement>(null);
  const auth = useRecoilValue(authState);
  const [employeeDetails, setEmployeeDetails] = useState<Employee[]>([]);
  interface FormData {
    user_ID: string;
    name: string;
    companyType: string;
    designation: string;
    phone: string;
    email_ID: string;
  }
  
  const [formData, setFormData] = useState<Employee>({
    user_ID:'',
    name: '',
    companyType: '',
    designation: '',
    phone: '',
    email_ID:'',
    role: '',
  });
  const [formValid, setFormValid] = useState({
    phone: false,
    email_ID: false
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string>('');
  const [searchButtonClicked, setSearchButtonClicked] = useState<boolean>(false);
  
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof Employee, boolean>>>({});



  interface Employee {
    user_ID: string;
    name: string;
    companyType: string;
    designation: string;
    phone: string;
    email_ID:string,
    role: string;

  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e){
    setSearchTerm(e.target.value);
    const searchResults = employeeDetails.filter((employee) =>
      Object.values(employee).some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    /*if(searchResults!==null){
    setFilteredEmployees(searchResults);
    }*/
    setFilteredEmployees(searchResults);
    setSearchButtonClicked(true);
  }
  else{
    setSearchTerm('');
    setSearchButtonClicked(false);
  }
  };

  /*const handleSearch = () => {
    const searchResults = employeeDetails.filter((employee) =>
      Object.values(employee).some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    /*if(searchResults!==null){
    setFilteredEmployees(searchResults);
    }
    setFilteredEmployees(searchResults);
    setSearchButtonClicked(true);
  };*/

  useEffect(() => {
    setFilteredEmployees(employeeDetails);
  }, [employeeDetails]);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (!isSidebarOpen) {
      setEditMode(false);
      setEditIndex(null);
      setFormData({
        user_ID:'',
        name: '',
        companyType: '',
        designation: '',
        phone: '',
        email_ID:'',
        role: '',
      });
    }
  };

  const toggleDetailsbar = () => {
    setShowUserDetails(!showUserDetails);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    

    // Mark the field as touched
    setTouchedFields({
      ...touchedFields,
      [name]: true
    });

    // Validate the input
    validateInput(name as keyof FormData, value);
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  const validateInput = (name: keyof FormData, value: string) => {
    switch (name) {
      case 'email_ID':
        setFormValid({
          ...formValid,
          email_ID: emailRegex.test(value)
        });
        break;
        case 'phone':
          setFormValid({
            ...formValid,
            phone:phoneRegex.test(value)
          });
          break;
        default:
          setFormValid({
            ...formValid,
            [name]: value.trim() !== ''
          });
      }
    };
  const handleEditEmployee = (employee: Employee, index: number) => {
    setFormData(employee);
    setEditMode(true);
    setEditIndex(index);
    setIsSidebarOpen(true);
  };

  const handleDeleteEmployee = () => {
    if (deleteIndex !== null) {
      const updatedEmployees = [...employeeDetails];
      updatedEmployees.splice(deleteIndex, 1);
      setEmployeeDetails(updatedEmployees);
      setShowDeleteModal(false);
      setDeleteIndex(null);
    }
  };
  const handleAddEmployee = () => {
    if (editMode && editIndex !== null) {
      const updatedEmployees = [...employeeDetails];
      updatedEmployees[editIndex] = {
        user_ID:formData.user_ID,
        name: formData.name,
        companyType: formData.companyType,
        designation: formData.designation,
        phone: formData.phone,
        email_ID: formData.email_ID,
        role: formData.role
      };
      setEmployeeDetails(updatedEmployees);
      setEditMode(false);
      setEditIndex(null);
      setIsSidebarOpen(false);
    } else {
      const newEmployee = {
        user_ID: formData.user_ID,
        name: formData.name,
        companyType: formData.companyType,
        designation: formData.designation,
        phone: formData.phone,
        email_ID: formData.email_ID,
        role: formData.role,
      };
      if (Object.values(formValid).every(Boolean)) {
      setEmployeeDetails([...employeeDetails, newEmployee]);
      setIsSidebarOpen(false);
      }
    }
    setFormData({

      user_ID:'',
      name: '',
      companyType: '',
      designation: '',
      phone: '',
      email_ID:'',
      role: ''
    });
  };
  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const payload = {
        refresh: refreshToken
      }
      const response = await axios.post('/users/logout/', payload, {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      });
      if (response) {
        localStorage.removeItem('token');
        localStorage.removeItem('currency');
        resetLoggedUser();
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };



  
  return (
    <div className='app'>
     <FontAwesomeIcon icon={faBars} className="top-right-icon" onClick={toggleSidebar} />
      <header className="header">
        <div className="top-details-icon" ref={userDetailsRef} onClick={toggleDetailsbar}>
          <div className="user-initial">{firstLetter}</div>
          {showUserDetails && userdetails && token ? (
            <div className="user-details">
              <p>{userdetails.name}-<p>{userdetails.user_id}</p></p>
              <p>{userdetails.company_type}</p>
              <p>{userdetails.designation}</p>
              <p>{userdetails.phone_number}</p>
              <p>{userdetails.email_id}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : <p></p>}
        </div>
      </header>
      <main>
        <div className="table-container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mb-0">Employee List</h2>
            <div id="search-container">
                <input type="text" placeholder="Search..."value={searchTerm} onChange={handleSearchChange}/>
            </div>
          </div>
          <table className="employee-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Company Type</th>
                <th>Designation</th>
                <th>Phone Number</th>
                <th>Email ID</th>
              </tr>
            </thead>
            <tbody>    
            {( searchTerm=='' )?employeeDetails.map((employee, index)=>(
                <tr key={index}>
                <td>{employee.user_ID}</td>
                <td>{employee.name}</td>
                <td>{employee.companyType}</td>
                <td>{employee.designation}</td>
                <td>{employee.phone}</td>
                <td>{employee.email_ID}</td>
              </tr>
              )):
              ( searchButtonClicked===true && searchTerm!=='' && filteredEmployees.length!==0)? filteredEmployees.map((employee, index)=>(
                <tr key={index}>
                <td>{employee.user_ID}</td>
                <td>{employee.name}</td>
                <td>{employee.companyType}</td>
                <td>{employee.designation}</td>
                <td>{employee.phone}</td>
                <td>{employee.email_ID}</td>
              </tr>
              )):<tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>No data found!</td>
            </tr>}

            </tbody>
          </table>
        </div>
      </main>

      {isSidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>Employee Details</h2>
            <FontAwesomeIcon icon={faTimes} className="cancel-icon" onClick={toggleSidebar} />
          </div>
          <form>
          <label>
              User ID :
              <br />
              <input type="text" name="user_ID" className="input" value={formData.user_ID} placeholder="Enter userID" onChange={handleInputChange} />
            </label>
            <label>
              Name :
              <br />
              <input type="text" name="name" className="input" value={formData.name} placeholder="Enter name" onChange={handleInputChange} />
            </label>
            <label>
              Company Type :
              <br />
              <input type="text" name="companyType" className="input" value={formData.companyType} placeholder="Enter companyType" onChange={handleInputChange} />
            </label>
            <label>
              Designation :
              <input type="text" name="designation" className="input" value={formData.designation} placeholder="Enter designation" onChange={handleInputChange} />
            </label>
            <label>
              Phone Number :
              <input type="tel" name="phone" value={formData.phone} className={`input ${touchedFields.phone && !formValid.phone ? 'error' : ''}`} placeholder="Enter number" onChange={handleInputChange} maxLength={10} />
            <br/>
            {touchedFields.phone &&!formValid.phone && <span className="error-message">Enter 10 digits with a valid format</span>}
            </label>
            <label>
               Email ID :
              <input type="email" name="email_ID" value={formData.email_ID} className={`input ${touchedFields.email_ID && !formValid.email_ID ? 'error' : ''}`} placeholder="Enter email" onChange={handleInputChange}></input>
              <br />
              {touchedFields.email_ID && !formValid.email_ID && <span className="error-message">Enter with a valid format (e.g: xyz@gmail.com) </span>}
            </label>
            <button type="button" className="btn btn-primary" onClick={handleAddEmployee} disabled={!Object.values(formValid).every(Boolean)}>Add</button>
          </form>
        </div>
      )}
    </div>


  );
};
export default Content;


/*
<tr key={index}>
                <td>{userdetails.user_id||employee.user_ID}</td>
                <td>{userdetails.name||employee.name}</td>
                <td>{userdetails.company_type||employee.companyType}</td>
                <td>{userdetails.designation||employee.designation}</td>
                <td>{userdetails.phone_number||employee.phone}</td>
                <td>{userdetails.email_id||employee.email_ID}</td>
              </tr>
              */