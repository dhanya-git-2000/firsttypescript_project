import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Constants from '../utils/Constants'
import { constants } from 'buffer';


interface MainpageProps {
  index:number;
  name: string;
  position: string;
  department: string;
  phone: string;
  role: string;
  email_id: string;
  password: string;

}

 function Mainpage(){
  //const firstLetter = name.charAt(0).toUpperCase();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<MainpageProps | null>(null);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [employeeDetails, setEmployeeDetails] = useState<Employee[]>(Constants.users);
  const [formData, setFormData] = useState<Employee>({
    name: '',
    position: '',
    department: '',
    phone: '',
    role: '',
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isToggleOn, setIsToggleOn] = useState<boolean>(false);
  const userDetailsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  interface Employee {
    name: string;
    position: string;
    department: string;
    phone: string;
    role: string;

  }
  /*
  const getLoggedInUserIndex = (): number => {
    const user = Constants.users.find(u => u.name === name);
    return user ? user.index : -1; // Return -1 if user is not found
  };
  const getLoggedInUser = (): MainpageProps => {
    const index = getLoggedInUserIndex();
    return Constants.users[index];
  };
  useEffect(() => {
    const user = getLoggedInUser();
    setUserDetails(user);
  }, []);*/

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDetailsRef.current && !userDetailsRef.current.contains(event.target as Node)) {
        setShowUserDetails(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (!isSidebarOpen) {
      setEditMode(false);
      setEditIndex(null);
      setFormData({
        name: '',
        position: '',
        department: '',
        phone: '',
        role: '',
      });
    }
  };

  const toggleDetailsbar = () => {
    setShowUserDetails(!showUserDetails);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'phone') {
      const formattedPhone = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: formattedPhone,
      });
    }
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

  };


  // const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const formattedPhone = e.target.value.replace(/\D/g, '');
  //   if (formattedPhone.length == 10) {
  //     setFormData({
  //       ...formData,
  //       phone: formattedPhone,
  //     });
  //   }
  // };

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

  const handleDeleteConfirm = (index: number) => {
    setShowDeleteModal(true);
    setDeleteIndex(index);
  };

  const handleLogout = () => {
    navigate('/');
  };
  /*const toggleSwitch = () => {
    if(role==='Admin'){
    setIsToggleOn(!isToggleOn);
    }
  };*/
  const handleAddEmployee = () => {
    if (editMode && editIndex !== null) {
      const updatedEmployees = [...employeeDetails];
      updatedEmployees[editIndex] = {
        name: formData.name,
        position: formData.position,
        department: formData.department,
        phone: formData.phone,
        role: formData.role
      };
      setEmployeeDetails(updatedEmployees);
      setEditMode(false);
      setEditIndex(null);
      setIsSidebarOpen(false);
    } else {
      const newEmployee = {
        name: formData.name,
        position: formData.position,
        department: formData.department,
        phone: formData.phone,
        role: formData.role,
      };
      setEmployeeDetails([...employeeDetails, newEmployee]);
      setIsSidebarOpen(false);
    }
    setFormData({
      name: '',
      position: '',
      department: '',
      phone: '',
      role: ''
    });
  };
  return (
    <div className='app'>
      <h1>Welcome to My App</h1>
      <header className="header">
        <FontAwesomeIcon icon={faBars} className="top-left-icon" onClick={toggleSidebar} />
        <div className="top-details-icon" ref={userDetailsRef} onClick={toggleDetailsbar}>
          <div className="user-initial">hi</div>
          {showUserDetails &&  userDetails &&(
            <div className="user-details">
              <p>{userDetails.name}-<p>{userDetails.role}</p></p>
              <p>{userDetails.position}</p>
              <p>{userDetails.department}</p>
              <p>{userDetails.phone}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <main className={isSidebarOpen ? "main-shrink" : ""}>
        <div className="table-container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mb-0">Employee List</h2>
            <div className="form-check form-switch mb-0">
              <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={isToggleOn}/*  onChange={toggleSwitch}*//>
            </div>
          </div>
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Phone Number</th>
                <th>Role</th>
                {isToggleOn? <th>Edit/Delete</th> : null}
              </tr>
            </thead>
            <tbody>
              {employeeDetails.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.name}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.role}</td>
                  {isToggleOn ? (
                    <td>
                      <button onClick={() => handleEditEmployee(employee, index)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => handleDeleteConfirm(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
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
              Name :
              <br />
              <input type="text" name="name" className="input" value={formData.name} onChange={handleInputChange} />
            </label>
            <label>
              Position :
              <br />
              <input type="text" name="position" className="input" value={formData.position} onChange={handleInputChange} />
            </label>
            <label>
              Department :
              <input type="text" name="department" className="input" value={formData.department} onChange={handleInputChange} />
            </label>
            <label>
              Phone Number :
              <input type="tel" name="phone" value={formData.phone} className="input" onChange={handleInputChange} maxLength={10} />
            </label>
            <label>
              Role :
              <input type="text" name="role" value={formData.role} className="input" onChange={handleInputChange} maxLength={10} />
            </label>
            <button type="button" className="btn btn-primary" onClick={handleAddEmployee} disabled={!formData.name || !formData.position || !formData.department || !formData.phone}>Add</button>
          </form>
        </div>
      )}

       {showDeleteModal && (
        <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} id="exampleModalCenter" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
                <button type="button" className="close" aria-label="Close" onClick={() => setShowDeleteModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleDeleteEmployee}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mainpage;




/*employee.role === 'Admin'
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface MainpageProps {
  email: string;
}

const Mainpage: React.FC<MainpageProps> = ({ email }) => {
  const location = useLocation();
  const firstLetter = email.charAt(0).toUpperCase();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<Employee>({
    name: '',
    position: '',
    department: '',
    phone: '',
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const userDetailsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  interface Employee {
    name: string;
    position: string;
    department: string;
    phone: string;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDetailsRef.current && !userDetailsRef.current.contains(event.target as Node)) {
        setShowUserDetails(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (!isSidebarOpen) {
      setEditMode(false);
      setEditIndex(null);
      setFormData({
        name: '',
        position: '',
        department: '',
        phone: '',
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
      [name]: value,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = e.target.value.replace(/\D/g, '');
    if (formattedPhone.length <= 10) {
      setFormData({
        ...formData,
        phone: formattedPhone,
      });
    }
  };

  const handleEditEmployee = (index: number) => {
    setFormData({
      name: employeeDetails[index].name,
      position: employeeDetails[index].position,
      department: employeeDetails[index].department,
      phone: employeeDetails[index].phone,
    });
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

  const handleDeleteConfirm = (index: number) => {
    setShowDeleteModal(true);
    setDeleteIndex(index);
  };

  const handleLogout = () => {
    navigate('/');

  };

  const handleAddEmployee = () => {
    if (editMode && editIndex !== null) {
      const updatedEmployees = [...employeeDetails];
      updatedEmployees[editIndex] = {
        name: formData.name,
        position: formData.position,
        department: formData.department,
        phone: formData.phone,
      };
      setEmployeeDetails(updatedEmployees);
      setEditMode(false);
      setEditIndex(null);
      setIsSidebarOpen(false);
    } else {
      const newEmployee = {
        name: formData.name,
        position: formData.position,
        department: formData.department,
        phone: formData.phone,
      };
      setEmployeeDetails([...employeeDetails, newEmployee]);
      setIsSidebarOpen(false);
    }
    setFormData({
      name: '',
      position: '',
      department: '',
      phone: '',
    });
  };

  return (
    <div className='app'>
      <h1>Welcome to My App</h1>
      <header className="header">
        <FontAwesomeIcon icon={faBars} className="top-left-icon" onClick={toggleSidebar} />
        <div className="top-details-icon" ref={userDetailsRef} onClick={toggleDetailsbar}>
          <div className="user-initial">{firstLetter}</div>
          {showUserDetails && (
            <div className="user-details">
              <p>{email}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <main className={isSidebarOpen ? "main-shrink" : ""}>
        <div className="table-container">
          <h2>Employee List</h2>
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Phone Number</th>
                {email === 'admin' || email === 'Admin' ? <th>Edit/Delete</th> : null}
              </tr>
            </thead>
            <tbody>
              {employeeDetails.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.name}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>{employee.phone}</td>
                  {email === 'admin' || email === 'Admin' ? (
                    <td>
                      <button onClick={() => handleEditEmployee(index)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => handleDeleteConfirm(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
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
              Name :
              <br />
              <input type="text" name="name" className="input" value={formData.name} onChange={handleInputChange} />
            </label>
            <label>
              Position :
              <br />
              <input type="text" name="position" className="input" value={formData.position} onChange={handleInputChange} />
            </label>
            <label>
              Department :
              <input type="text" name="department" className="input" value={formData.department} onChange={handleInputChange} />
            </label>
            <label>
              Phone Number :
              <input type="tel" name="phone" value={formData.phone} className="input" onChange={handlePhoneChange} maxLength={10} />
            </label>
            <button type="button" className="btn btn-primary" onClick={handleAddEmployee} disabled={!formData.name || !formData.position || !formData.department || !formData.phone}>Add</button>
          </form>
        </div>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to delete this employee?</h4>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeleteEmployee}>
              Delete
            </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Mainpage;


/*function Mainpage() {
    return (
        <h1>hello </h1>
    )
};
<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to delete this employee?</h4>
          <div className="modal-buttons">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeleteEmployee}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>

export default Mainpage;*/
