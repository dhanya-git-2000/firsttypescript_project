import {atom} from "recoil";


export const loggedUserState = atom({
    key: 'loggedUser',
    default: {
        user_id:'',
        name:'',
        email_id:'',
        designation:'',
        company:'',
        company_type:'',
        phone_number:'',
    }
});

export const authState = atom({
    key: 'authState',
    default: {
      tokens: {
        token:localStorage.getItem('token'),
        refresh: localStorage.getItem('token')
      },
      user: null,
    },
  });


