import React, { useEffect, useState, Fragment, useRef, useContext } from 'react'
import { OxfordDictionaryResult, TwinwordMeaning } from '../context/types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Logo from "../assets/images/logo.png";
import '../layout/layout.scss';
import OxfordThesaurus from './Dictionary/oxfordThesaurus';
import WordsApi from './Dictionary/wordsApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import Spinner from "../assets/images/spinner.svg";
import Twinword from './Dictionary/twinword';
import { AlertContext } from '../context/alert/AlertContextProvider';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import { Event, SetDimension, InitPageViewAndSetGA } from "../components/Tracking";

const DictionaryThesaurus = () => {


    const history = createBrowserHistory();
    const anonynousCurrentUserToken = localStorage.getItem('currentUserToken') && localStorage.getItem('currentUserToken')?.includes('Anonymous');

    const user: any = localStorage.getItem('currentUser');
    const currentUser: any = JSON.parse(user);
    /*
    history.listen(location => {
        console.log("Tracking page view in Dictionary Meaning");
        ReactGA.set({ 
            userId: currentUser?.email ? currentUser?.email : anonynousCurrentUserToken,
            page: location.pathname 
        }); 
        ReactGA.pageview(location.pathname); 
    });
*/

    const alertContext = useContext(AlertContext);
    const initialValue: any = {};
    const initialTwinValue: TwinwordMeaning = {
        entry: '',
        request: '',
        response: '',
        meaning: {
            noun: '',
            verb: '',
            adverb: '',
            adjective: '',
        },
        result_msg: '',
        ipa: ''
    };
    const urlParams = new URLSearchParams(window.location.search);
    const initialOxfordValue: OxfordDictionaryResult[] = [];
    const word = urlParams.get('w');
    const language = urlParams.get('l') || 'EN';
    const scope = urlParams.get('s') || 'THESAURUS';

    const [emptyResultMessage, setEmptyResultMessage] = useState('No match found in the Dictionary.');
    const [wordsApiResult, setWordsApiResult] = useState(initialValue);
    const [oxfordResult, setOxfordResult] = useState(initialOxfordValue);
    const [twinResult, setTwinResult] = useState(initialTwinValue);
    const [fetching, setFetching] = useState(true);
    const [notFound, setNotFound] = useState(false);
    //const user: any = localStorage.getItem('currentUser');
    //const currentUser: any = JSON.parse(user);
    let dicName = '';
    const dictionaryList = ['OXFORDDICTIONARIES', 'WORDSAPI', 'TWINWORD'];

    const getDefaultDic = async () => {
        try{
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/filter/default-dictionary`);
            dicName = result.data.name;
        }catch(err){
            console.error("Error Retrieving default dictionary",err);
            dicName = 'OXFORDDICTIONARIES';
        }

        getWordInfo();
    }

    const getWordInfoFallback = async () => {
        try {
            const dictionariesToTry = dictionaryList.filter((e: any)=>e != dicName);
            let tempResult ;
            for (let entry of dictionariesToTry) {
                try{
                    tempResult = await axios.get(`${process.env.REACT_APP_BASE_URL}/aggregated-dictionary/lookup?lang=${language}&provider=${entry}&scope=${scope}&word=${word}`);

                    if (tempResult.status === 200 ){
                        return {dict:entry, result:tempResult};
                    }                        
                }catch (e0) {
                    //console.info("Error retrieving dictionary data from server for:"+entry);
                }
            }
        } catch (e) {
            console.error("Error retrieving dictionary data for fallback ");
        }
    }

    const getWordInfo = async () => {
        try {
            let result
            try {
                result = await axios.get(`${process.env.REACT_APP_BASE_URL}/aggregated-dictionary/lookup?lang=${language}&provider=${dicName}&scope=${scope}&word=${word}`);
            } catch (e) {
                //console.log("Error getting data:"+e);
            }
            if (result && result.status === 200 ){
                try{
                    if (dicName === 'OXFORDDICTIONARIES') {
                        setOxfordResult(result.data.providerDefinition.results);
                    } else if (dicName === 'TWINWORD') {
                        setTwinResult(result.data.providerDefinition)
                    } else {
                        setWordsApiResult(result.data.providerDefinition);
                    }
                    setFetching(false);
                }catch (e0) {
                    //console.log("Error extracting data from server response");

                    setNotFound(true);
                    setFetching(false);
                }
            }else if (result && result.status >= 500){
                setNotFound(true);
                setFetching(false);
                setEmptyResultMessage('There was an issue communicating with the servers. Please try again later, or contact the support team at info@beebl.io');
            }else{
                
                const fallbackResult = await getWordInfoFallback() as any;
                if ( fallbackResult && fallbackResult.dict && fallbackResult.result ){
                    if (fallbackResult.dict === 'OXFORDDICTIONARIES') {
                        setOxfordResult(fallbackResult.result.data.providerDefinition.results);
                    } else if (fallbackResult.dict === 'TWINWORD') {
                        setTwinResult(fallbackResult.result.data.providerDefinition)
                    } else {
                        setWordsApiResult(fallbackResult.result.data.providerDefinition);
                    }
                    setFetching(false);
                }else {
                    throw new Error("No dictionary data found");;
                }
            }

        } catch (e) {
            setNotFound(true);
            setFetching(false);
            setEmptyResultMessage('No match found in the Dictionary.');
            //console.log("Error getting dictionary data: "+e);
        }
    }

    useEffect(() => {

        let userId = 'anonymous';
        if (currentUser) {
            userId = currentUser.email;
            dicName = currentUser.dictionary.name;
            getWordInfo();
        } else {
            getDefaultDic();
        }
        InitPageViewAndSetGA({userId:userId , word:word});
        Event('Thesaurus', 'View Thesaurus entry', 'Viewed Thesaurus entry for: '+word);
    }, [word])

    return (
        <div>
            <div className="bg-light pt-2 pb-3">
                <div className="d-flex justify-content-between align-items-center container">

                    <ReactGA.OutboundLink to="/" eventLabel="Logo"  target="_self" className="navbar-brand logo" href="index.html">
                        <img id="logo-img" className="img-center" src={Logo} alt="logo" width="200px" />
                    </ReactGA.OutboundLink>


                    <li className="nav-item text-dark"> 
                      <ReactGA.OutboundLink to="https://www.beebl.io/about-us/" eventLabel="About us" >
                        <a className="nav-link page-scroll" >About Beeblio</a>
                      </ReactGA.OutboundLink>
                    </li>

                    <li className="nav-item text-dark"> 
                    <ReactGA.OutboundLink to="/#howitworks" eventLabel="How it workds" >
                        <a className="nav-link page-scroll" >How it works</a>
                    </ReactGA.OutboundLink>
                    </li>

                    
                    <ReactGA.OutboundLink to="/" eventLabel="Home"  target="_self" className="btn btn-white btn-sm topbtn">
                        <FontAwesomeIcon className="mr-2" icon={faHome} /> Home
                    </ReactGA.OutboundLink>

                </div>
            </div>

            <div className="card mt-4 pl-5 container p-4 d-flex justify-content-center align-items-start flex-column text-left">
                <h1 className="text-primary">{word} - synonyms</h1>

                <ReactGA.OutboundLink to={`/meaning?w=${word}`} eventLabel="Thesaurus"  target="_self" className="btn btn-white btn-sm topbtn">
                 Definition
                </ReactGA.OutboundLink>

                {fetching && <div className="d-flex justify-content-center align-items-center">
                    <img className="mx-auto text-center" src={Spinner} />
                </div>}
                {
                    notFound && <p className="pt-4 text-info lead">{emptyResultMessage}</p>
                }

                {!notFound && <div>
                    {/* wordsApi */}
                    {((dicName !== 'OXFORDDICTIONARIES' && wordsApiResult) &&
                        Object.entries(wordsApiResult).length > 0) &&
                        <WordsApi wordsApiResult={wordsApiResult} />
                    }

                    {/* twin */}

                    {(dicName !== 'OXFORDDICTIONARIES' && twinResult) &&
                        <Twinword twinResult={twinResult} />
                    }

                    {/* oxford */}
                    {(oxfordResult && oxfordResult.length > 0) &&
                        <OxfordThesaurus oxfordResult={oxfordResult} />
                    }
                </div>}
            </div>
        </div>
    )
}

export default DictionaryThesaurus;