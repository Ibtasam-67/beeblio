import React, { useReducer, Dispatch, useContext } from 'react';
import FilterReducer from './FilterReducer';
import axios from 'axios';
import {
    GET_FILTERED_CONTENT, HTTP_ERROR, SET_CURATED_CONTENT_URL, LOADER
} from '../types';
import { createContext } from 'react';
import { authAxios } from '../../api/authApi';
import { AlertContext } from '../alert/AlertContextProvider';


// Create Context
const initialState = {
//    filterHasRun: false,
    filteredResults: [],
    curatedContent: { url: null, id: '', link: null, sourceLink: null, contentLink: null },
    error: '',
    loading: false,
    getFilteredContent: (filterCriteria: any) => { },
    setCuratedContentUrl: (url: any) => { },
    clearResults: () => { },
    setResults: (data: any) => { }
}
export const FilterContext = createContext(initialState);

// Provider Component
export const FilterContextProvider = (props: any) => {

    const [state, dispatch] = useReducer(FilterReducer, initialState);
    const alertContext = useContext(AlertContext);
    // Get FilteredContent
    const getFilteredContent = async (filterCriteria: any) => {
        try {
            let result: any;
            const criteriaWithNoFile = {
                content: filterCriteria.content ? filterCriteria.content.trim() : '',
                filterLimit: filterCriteria.filterLimit,
                sorting: filterCriteria.sorting,
                contractionOption: filterCriteria.contractionOption,
                contentId: filterCriteria.contentId,
                url: filterCriteria.url ? filterCriteria.url.trim() : ''
            }
            if (localStorage.getItem('currentUserToken')) {
                dispatch({
                    type: LOADER,
                    payload: true
                });

                const formData = new FormData();
                const jsonFilterCriteria = JSON.stringify(criteriaWithNoFile);
                const blobFilterCriteria = new Blob([jsonFilterCriteria], {
                    type: 'application/json'
                });
                formData.append("filterData", blobFilterCriteria);
                formData.append("filterFile", filterCriteria.selectedFile);
                try {
                    result = await authAxios.post(`${process.env.REACT_APP_BASE_URL}/filter`, formData, {
                        headers: {
                            'Content-Type': 'multipart/mixed'
                        }
                    });

                    const filterCriteriaObject = localStorage.getItem('filterCriteria');
                    if (filterCriteriaObject !== null) {
                        filterCriteria = JSON.parse(filterCriteriaObject);

                        if (result && result.data && result.data.contentId) {
                            filterCriteria['contentId'] = result.data.contentId;
                            localStorage.setItem('filterCriteria', JSON.stringify(filterCriteria));
                            localStorage.setItem('filteredResults', JSON.stringify(result.data.filterResult));
                        }
                    }

                } catch (error) {
                    alertContext.setWarningAlert('Something went wrong. Please refresh the page or try a different resource');
                    dispatch({
                        type: HTTP_ERROR,
                        payload: true
                    });
                }

                dispatch({
                    type: LOADER,
                    payload: false
                });
            } else {
                dispatch({
                    type: LOADER,
                    payload: true
                });

                const formData = new FormData();
                const jsonFilterCriteria = JSON.stringify(criteriaWithNoFile);
                const blobFilterCriteria = new Blob([jsonFilterCriteria], {
                    type: 'application/json'
                });
                formData.append("filterData", blobFilterCriteria);
                formData.append("filterFile", filterCriteria.selectedFile);
                try {
                    result = await axios.post(`${process.env.REACT_APP_BASE_URL}/filter`, formData, {
                        headers: {
                            'Content-Type': 'multipart/mixed'
                        }
                    }
                    );
                    localStorage.setItem('currentUserToken', result.headers.authorization);

                    const filterCriteriaObject = localStorage.getItem('filterCriteria');

                    if (filterCriteriaObject !== null) {
                        filterCriteria = JSON.parse(filterCriteriaObject);

                        if (result && result.data && result.data.contentId) {
                            filterCriteria['contentId'] = result.data.contentId;
                            localStorage.setItem('filterCriteria', JSON.stringify(filterCriteria));
                            localStorage.setItem('filteredResults', JSON.stringify(result.data.filterResult));
                        }
                    }

                } catch (error) {
                    alertContext.setWarningAlert('Something went wrong. Please refresh the page or try a different resource');
                    dispatch({
                        type: HTTP_ERROR,
                        payload: true
                    });
                }

                dispatch({
                    type: LOADER,
                    payload: false
                });
            }
            dispatch({
                type: GET_FILTERED_CONTENT,
                payload: result.data.filterResult
            });
        } catch (err) {
            const { response } = err;
            dispatch({
                type: HTTP_ERROR,
                payload: (response && response.data) ? response.data.message : ''
            });
        }
    };

    const setCuratedContentUrl = (response: string) => {
        dispatch({
            type: SET_CURATED_CONTENT_URL,
            payload: response
        });
    }

    const setResults = (data: any) => {
        dispatch({
            type: GET_FILTERED_CONTENT,
            payload: data
        });
    }

    const clearResults = () => {
        dispatch({
            type: GET_FILTERED_CONTENT,
            payload: []
        });
    }

    return (
        <FilterContext.Provider
            value={{
//                filterHasRun:
                filteredResults: state.filteredResults,
                curatedContent: state.curatedContent,
                error: state.error,
                loading: state.loading,
                setResults,
                getFilteredContent,
                setCuratedContentUrl,
                clearResults
            }}>
            {props.children}
        </FilterContext.Provider>
    );
};

