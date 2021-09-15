import { useContext, useEffect, useState } from "react"
import { FilterContext } from '../context/filter/FilterContextProvider';
import { AuthContext } from '../context/auth/AuthContextProvider';

// const useErrorHandler = () => {

//     const filterContext = useContext(FilterContext);
//     const authContext = useContext(AuthContext);

//     const [errorState, setErrorState] = useState('');

//     useEffect(() => {
//         setErrorState(filterContext.error);
//     }, [filterContext]);


//     useEffect(() => {
//         setErrorState(authContext.error);
//     }, [authContext]);

//     return errorState;

// }

// export default useErrorHandler;