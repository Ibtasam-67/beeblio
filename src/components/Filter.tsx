import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { FilterContext } from '../context/filter/FilterContextProvider';
import Creatable, { makeCreatableSelect } from 'react-select/creatable';
import { Content } from '../context/types';
import { Progress } from 'reactstrap';
import { AlertContext } from '../context/alert/AlertContextProvider';



import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

import { Event, SetDimension, InitPageViewAndSetGA } from "../components/Tracking";




//const trackingId: any = process.env.GA_TRACKING_ID;
//ReactGA.initialize(trackingId);



const validate = (values: any) => {
    const errors: any = {};

    if (!values.file) {
        if (!values.content) {
            errors.content = 'Required';
        }
    }
    return errors;
};



const options = [
    { value: '10', label: '10' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
    { value: '200', label: '200' },
    { value: '250', label: '250' },
    { value: '500', label: '500' },
    { value: '750', label: '750' },
    { value: '1000', label: '1000' },
    { value: '2000', label: '2000' },
    { value: '2500', label: '2500' },
    { value: '5000', label: '5000' },
    { value: '10000', label: '10000' },
    { value: '15000', label: '15000' },
    { value: '20000', label: '20000' },
    { value: '25000', label: '25000' },
    { value: '50000', label: '50000' },
    { value: '75000', label: '75000' },
    { value: '85000', label: '85000' },
    { value: '90000', label: '90000' },
    { value: '100000', label: '100000' }

];

const Filter = () => {
    
    const history = createBrowserHistory();
    const anonynousCurrentUserToken = localStorage.getItem('currentUserToken') && localStorage.getItem('currentUserToken')?.includes('Anonymous');

    const user: any = localStorage.getItem('currentUser');
    const [currentUser, setCurrentUser] = useState(JSON.parse(user));
    /*
    history.listen(location => {
      ReactGA.set({ 
            userId: currentUser?.email ? currentUser?.email : anonynousCurrentUserToken,
            page: location.pathname 
        }); 
      ReactGA.pageview(location.pathname); 
    });
*/
    const [selectedOption, setSelectedOption] = useState('');
    const [occuranceError, setOccuranceError] = useState(false);
    const [searchedContetnt, setSearchedContetnt] = useState();
    const [collectionContetnt, setCollectionContetnt] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const filterContext = useContext(FilterContext);
    const [showProgress, setShowProgress] = useState(false);
    const currentUserToken = localStorage.getItem('currentUserToken') && localStorage.getItem('currentUserToken')?.includes('Bearer');
    let progress = 0;
    const [progressValue, setProgressValue] = useState(0);
    const videoRef: any = useRef(null);
    const videoControlRef: any = useRef(null);
    const [shouldPlay, setShouldPlay] = useState(true);
    const [videoLoading, setVideoLoading] = useState(false);

    const curatedContentUrl =
        filterContext.curatedContent.contentLink ? filterContext.curatedContent.contentLink :
            filterContext.curatedContent.url ? filterContext.curatedContent.url :
                filterContext.curatedContent.link;
    let curatedContentId = filterContext.curatedContent.id

    //const [contentId, setContentId] = useState(curatedContentId);

    const alertContext = useContext(AlertContext);
    const [sortingType, setSortingType] = useState('FREQUENCY_REVERSE');
    const [contractionOption, setContractionOption] = useState('REMOVE_CONTRACTION');
    const loading = filterContext.loading;
    const [timer, setTimer] = useState(null);
    const progressBreak = 1000;
    const progressDuration = 60;
    const progressAmount = 100 / progressDuration;
    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            background: '#F1F1F1',
            fontSize: '13px',
            color: '#111121'
        }),
        control: (provided: any) => ({
            ...provided,
            background: '#F1F1F1',
            border: '1px solid rgba(0, 0, 0, 0.458824)',
            fontSize: '13px',
            color: '#111121'
        })
    }

    const handleVideo = async () => {
        setVideoLoading(true);
        try {
            setVideoLoading(false);
//            videoRef.current.src = 'https://wps2.beebl.io/public/beeblio-tutorial.m4v';

            if(shouldPlay){
                videoControlRef.current.src = 'https://wps2.beebl.io/public/pause-button.svg';
                videoRef.current.style.display = 'inline-block';
                videoRef.current.play();
                Event('Filter', 'Interacting with Video Tutorial', 'Playing Video Tutorial');
            }else{
                videoRef.current.style.display = 'none';
                videoControlRef.current.src = 'https://wps2.beebl.io/public/play-button.svg';
                videoRef.current.pause();
                Event('Filter', 'Interacting with Video Tutorial', 'Pausing Video Tutorial');
            }
            setShouldPlay(!shouldPlay);

            

        } catch (error) {
            console.log("error in handleVideo");
            console.log(error);
            alertContext.setErrorAlert('Error Playing Video');
            setVideoLoading(false);
        }
    }

    const formik = useFormik({
        initialValues: {
            content: '',
            file: undefined
        },
        validate,
        onSubmit: async values => {

            console.log("Recording on submit event");
            Event("Filter", "Submit Filter", "Sent a request to filter");

            if (!selectedOption || selectedOption === '') {
                setOccuranceError(true);
                return;
            }
            let isUrl = false;
            if (formik.values.content) { 
                isUrl = validateUrl(formik.values.content.toLowerCase().trim()); 
            }
            const number: any = selectedOption;

            let contentId = '';
            if( collectionContetnt ){
                const cc: any = collectionContetnt;
                contentId = (cc.content === formik?.values?.content || cc?.url === formik?.values?.content) ? cc?.contentId : '';
            }else if ( searchedContetnt ){
                const sc: any = searchedContetnt;
                contentId = (sc.content === formik?.values?.content || sc.url === formik?.values?.content) ? sc.contentId : null;            
            }
            if(!contentId && filterContext.curatedContent.id){
                contentId = filterContext.curatedContent.id;
            }

            const filterCriteria =
            {
                content: (curatedContentUrl || isUrl) ? null : formik.values.content,
                filterLimit: +selectedOption,
                sorting: sortingType,
                contractionOption: contractionOption,
                contentId: contentId,
                url: (curatedContentUrl || isUrl) ? ( formik.values.content ? formik.values.content.trim() : '' ) : null,
                selectedFile: selectedFile
            };
            //setContentId('');
            localStorage.setItem('filterCriteria', JSON.stringify(filterCriteria));
            filterContext.getFilteredContent(filterCriteria);


            localStorage.removeItem('collectionFilterCriteria');
            localStorage.removeItem('searchedFilterCriteria');
        }
    });


    useEffect(() => {
        if (loading) {
            startProgress();
        } else {
            stopProgress();
        }
    }, [loading]);

    const startProgress = () => {
        progress = 0;
        setProgressValue(0);
        setShowProgress(true);
        let tempTimer: any = timer;
        tempTimer = setInterval(function () {
            progress = progress + progressAmount;
            setProgressValue(progress);
            if (progress >= 150) {
                clearInterval(tempTimer)
            }
        }, progressBreak);
        setTimer(tempTimer);
    }

    const stopProgress = () => {
        let tempTimer: any = timer;
        clearInterval(tempTimer);
        setTimeout(() => {
            setProgressValue(100);
        }, 100);
        setTimeout(() => {
            setShowProgress(false);
        }, 1000);

    }


    useEffect(() => {

        let userId: any = 'anonymous';

        if (currentUser) {
            userId = currentUser.email;
        } else if ( anonynousCurrentUserToken ){
            userId = anonynousCurrentUserToken
        }
        InitPageViewAndSetGA({userId:userId });
        Event('Filter', 'Loading Filter page', 'Loading filter page ');


        const prevFilterDay: any = localStorage.getItem('filterCriteria');
        const tempSearch: any = localStorage.getItem('searchedFilterCriteria');
        const tempCollection: any = localStorage.getItem('collectionFilterCriteria');
        if (tempCollection) {
            setCollectionContetnt(JSON.parse(tempCollection));
        } else if (tempSearch) {
            setSearchedContetnt(JSON.parse(tempSearch));

        } else if (prevFilterDay) {
            setSearchedContetnt(JSON.parse(prevFilterDay));
        }
    }, []);

    useEffect(() => {
        if (collectionContetnt) {
            const temp: any = collectionContetnt;
            //formik.setFieldValue('content', temp.content ? temp.content : temp.url ? temp.url : null);
            formik.setFieldValue('content', temp.url ? temp.url : temp.content ? temp.content : null);
            if (temp.contentId) {
                curatedContentId = temp.contentId;
            }
        }
    }, [collectionContetnt])


    useEffect(() => {
        if (searchedContetnt) {

            const temp: any = searchedContetnt;
            formik.setFieldValue('content', temp.url ? temp.url : temp.content ? temp.content : null);
            if (temp.contentId) {
                curatedContentId = temp.contentId;
            }

            setSelectedOption(temp?.filterLimit?.toString());
            setSortingType(temp.sorting);
            setContractionOption(temp.contractionOption);
        }

    }, [searchedContetnt]);

    useEffect(() => {
        if (curatedContentUrl !== '') {
            formik.setFieldValue('content', curatedContentUrl);
        }
    }, [curatedContentUrl]);

    const validateUrl = (value: string) => {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value) || ( value.trim().toLowerCase().startsWith('www.') && value.trim().length <= 512 );
    }


    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (selectedOption === '') { setOccuranceError(true) };
        formik.handleSubmit();
    };

    const handleFileChange = (e: any) => {
        setSelectedFile(e.target.files[0]);
        formik.values.content='';
        Event('Filter', 'Interacting with File  Upload', 'Interacting with File  Upload');
    };

    useEffect(() => {
        formik.setFieldValue('file', selectedFile);
    }, [selectedFile])

    const handleChange = (newValue: any, actionMeta: any) => {
        if (newValue.value !== '') {
            if (+newValue.value > 0 && +newValue.value <= 100000) {
                setOccuranceError(false);
                setSelectedOption(newValue.value);
            } else {
                setOccuranceError(true);
            }
        }

    };
    const handleInputChange = (inputValue: any, actionMeta: any) => {
        Event('Filter', 'Interacting with Filter number', 'Entered a filter number = '+inputValue);
        if (inputValue && inputValue !== '') {
            if (+inputValue > 0 && +inputValue < 100000) {
                setOccuranceError(false);
                setSelectedOption(inputValue);
            } else {
                setOccuranceError(true);
            }
        }
    };
    return (
        <div className="align-center mt-5" id="filter">
            <div className="container mt-sm-5">
                <div className="row align-items-center">
                    <div className="col-md-8 midcol">
                        <div className="login-form text-center box-shadow px-5 py-5 xs-px-2 xs-py-2">
                            <h2 className=" mb-2">Welcome to Beeblio</h2>
                            <p className="mb-0">Do you want to improve your vocabulary? </p>
                            <p> Find and learn complex words from any text you can access.
                            </p>
                            <p>
                            <span className="text-center" style={{ fontSize: '80%',display: 'inline' }}>
                              <ReactGA.OutboundLink to="#howitworks" eventLabel="details">

                                <a  style={{display: 'inline' }} className="nav-link page-scroll m-0 p-0" >Here's <b style={{ fontSize: '100%' }}>Exactly How It Works</b> 
                                </a>
                              </ReactGA.OutboundLink>


                            <a  style={{display: 'inline', cursor: 'pointer' }} onClick={() => { handleVideo() }}
                            className="nav-link page-scroll m-0 p-0" >

                            <img width="25px" height="25px" 
                                src={'https://wps2.beebl.io/public/play-button.svg'}
                                alt="Short Video" ref={videoControlRef} /> 

                            </a>

                            <div className="text-center" >
                                    <video ref={videoRef} width="320px"  height="240px" controls style={{ display: 'none',textAlign: 'center' }} >

                                    <source src="https://wps2.beebl.io/public/beeblio-tutorial.m4v" type="video/mp4" />
                                    </video>

                            </div>
                            </span>                                
                            </p>

                            <form id="contact-form" onSubmit={(e) => handleSubmit(e)}>
                                <div className="messages"></div>
                                <div className="form-group" style={{textAlign: 'left' }}>
                                    {/* required="required" */}
                                    <span className="text-info lead" style={{ display: 'inline-block', fontSize: '80%' }}>Content: (paste the URL or the text. URLs should start with http or 'www.')</span>
                                    <textarea id="content" name="content" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.content} className="form-control" placeholder="Text to filter" ></textarea>

                                    <div className="help-block with-errors">
                                        {formik.touched.content && formik.errors.content ? (
                                            <div>{formik.errors.content}</div>
                                        ) : null}
                                    </div>

                                    <div className="help-block" style={{ textAlign: 'left' }}>
                                        <p style={{ display: 'inline-block', fontSize: '80%' }} >Or upload a file <span style={{ display: 'inline-block', fontSize: '80%' }}>(pdf, epub, txt, html, doc, docx, odt, rtf) &nbsp;&nbsp;&nbsp;</span> </p>
                                        <input style={{ display: 'inline-block', fontSize: '80%' }} type="file" accept=".pdf, .epub, .txt, .html, .doc, .docx, .odt, .rtf" onChange={(e) => { handleFileChange(e) }} />
                                    </div>


                                </div>
                                <div className="form-group" style={{ zIndex: 100, textAlign: 'left' }}>
                                    {/* required="required" */}
                                    {/* <input id="numberOfOccurance" name="numberOfOccurance" onBlur={formik.handleBlur}
                                        onChange={formik.handleChange} value={formik.values.numberOfOccurance}
                                        className="form-control"
                                        placeholder="Enter or select the number of most frequently used words to remove. " data-error="Empty" /> */}
                                    <span className="text-info lead" style={{ display: 'inline-block', fontSize: '80%' }}>Enter or select the number of most frequently used words to remove.</span>    
                                    <Creatable
                                        formatCreateLabel={userInput => `Select ${userInput}`}
                                        styles={customStyles}
                                        options={options}
                                        value={{ label: selectedOption === '' ? 'Please enter a number' : selectedOption, value: selectedOption }}
                                        onInputChange={handleInputChange}
                                        onChange={handleChange}
                                    // noOptionsMessage={() => null}
                                    />
                                    <div className="help-block with-errors">
                                        {occuranceError ? (<div>Should be a number greater than 0 and lower than 100000</div>) : null}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <select className="form-control" value={sortingType} onChange={(e) => { setSortingType(e.target.value); Event('Filter', 'Interacting with Ordering option', 'Entered the ordering option:  '+e.target.value); }}>
                                        <option value='FREQUENCY_REVERSE'>Show the result in reverse order of frequency</option>
                                        <option value='FREQUENCY'>Show the result in order of frequency</option>
                                        <option value='NATURAL'>Show the result in order of occurrence</option>
                                        <option value='ALPHABETICAL'>Show the result in alphabetical order</option>
                                        <option value='ALPHABETICAL_REVERSE'>Show the result in reverse alphabetical order</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <select className="form-control" value={contractionOption} onChange={(e) => { setContractionOption(e.target.value); Event('Filter', 'Interacting with Contraction option', 'Entered the contraction option:  '+e.target.value); }}>
                                        <option value='REMOVE_CONTRACTION'>Focus on the most relevant words by removing the contractions and other forms</option>
                                        <option value='LEAVE_CONTRACTION'>View everything by leaving the contractions and all</option>
                                    </select>
                                </div>
                                {!showProgress && <button className="btn btn-theme btn-lg" id="panel-trigger" type="submit"><span>Filter And Check Out Your Results</span></button>
                                }
                                <br />
                                {showProgress && <Progress value={progressValue} />}

                                {!currentUserToken && <p style={{ paddingTop: '12px' }}>Do you want to save your search history or choose your own dictionary?</p>}

                                 {!currentUserToken && <ReactGA.OutboundLink to="auth" eventLabel="auth" className="btn btn-theme btn-lg">
                                    <span>SIGN UP - IT'S FREE</span>
                                </ReactGA.OutboundLink>}




                            </form>
                        </div>
                    </div>
                </div>
            </div>
        

        </div>
    );
}

export default Filter;

