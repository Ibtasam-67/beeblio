import React, { useState, useEffect, Fragment, useContext, useRef } from 'react';
import OwlCarousel from 'react-owl-carousel';
import { authAxios } from '../../api/authApi';
import { AlertContext } from '../../context/alert/AlertContextProvider';
import CollectionDetail from './CollectionDetail';
import Spinner from '../../assets/images/spinner.svg';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faSpinner, faVolumeUp, faTimes, faTrashAlt, faBook, faAngleUp, faAngleDown, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Collapse, CardBody, Card, CardHeader, TabContent, TabPane, Nav, NavItem, NavLink, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { LOGO_CONTENT_SOURCE_MAP } from '../../constants';
import { Event, SetDimension, InitAndPageViewGA } from "../../components/Tracking";
import ReactGA from 'react-ga';


export const Saved = () => {

    const [owlState, setOwlState] = useState({
        options: {
            margin: 10,
            responsive: {
                0: {
                    items: 1,
                },
                600: {
                    items: 3,
                },
                1000: {
                    items: 3,
                }
            }
        }
    });
    const [collectionDetail, setCollectionDetail] = useState({});
    const [likedWords, setLikedWords] = useState([]);
    const [wordsFetched, setWordsFetched] = useState(false);
    const [contentFetched, setContentFetched] = useState(false);
    const [likedContents, setLikedContents] = useState([]);
    //const [dictionaries, setDictionaries] = useState([]);
    const alertContext = useContext(AlertContext);
    const [currentUser, setCurrentUser] = useState({id:'', dictionary: { id: '' } });
    const history = useHistory();
    const [wordPageNumber, setWordPageNumber] = useState(0);
    const [wordPageCount, setWordPageCount] = useState(0);
    const [contentPageNumber, setContentPageNumber] = useState(0);
    const [contentPageCount, setContentPageCount] = useState(0);
    const ref = useRef(null);
    const contentRef = useRef(null);
    const [audioLoading, setAudioLoading] = useState(false);
    const audioRef: any = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [wordReacting, setWordReacting] = useState(false);
    const [contentReacting, setContentReacting] = useState(false);
    const [collapse, setCollapse] = useState(0);
    const [collapseArray, setCollapseArray] = useState([]);
    const [collapseArrayTab2, setCollapseArrayTab2] = useState([]);
    const [innerCollapseArray, setInnerCollapseArray] = useState([]);
    const [activeTab, setActiveTab] = useState('1');
    const [tempIndex, setTempIndex] = useState(-1);

    const fetchProfile = async () => {
        const userResult = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/user/me`);
        localStorage.setItem('currentUser', JSON.stringify(userResult.data));
    }

    const fetchContents = async () => {
        const likedContetnResult = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/event?asList=false&domain=CONTENT&page=${contentPageNumber}`);


        let updatedList: any = [];
        if (contentReacting) {
            updatedList = [...likedContetnResult.data.content];
            setContentReacting(false);
        } else {
            updatedList = [...likedContents, ...likedContetnResult.data.content];
        }

        const initialCollapseArray = [] as any;

        for(var i: number = 0; i < updatedList.length; i++) {

            initialCollapseArray[i] = Array(10).fill(-1) as any;
        }

        setCollapseArrayTab2( initialCollapseArray );
        setLikedContents(updatedList);
        setContentFetched(true);
        setContentPageCount(likedContetnResult.data.pageCount);
    }

    const fetchWords = async () => {
        let likedWordsResult: any = null;
        likedWordsResult = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/event?asList=false&domain=WORD&page=${wordPageNumber}`);
        let updatedList: any = [];
        if (wordReacting) {
            updatedList = [...likedWordsResult.data.content];
            setWordReacting(false);
        } else {
            updatedList = [...likedWords, ...likedWordsResult.data.content];
        }
        setLikedWords(updatedList);
        setWordsFetched(true);

        const initialCollapseArray = [] as any;
        for(var i: number = 0; i < updatedList.length; i++) {

            initialCollapseArray[i] = Array(10).fill(-1) as any;
        }
        
        setCollapseArray( initialCollapseArray );

        setWordPageCount(likedWordsResult.data.pageCount);
    }



    const getCollection = async (contentId: string) => {

        let result: any = null;
        result = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/search?entity=interaction&user_id=${currentUser.id}&content_id=${contentId}`);
        const detail = (result && result.data && result.data.results && result.data.results.length>0) ? result.data.results[0] : {};
        //setCollectionDetail(detail);
        return detail;
    }

    const getLogo =  (search: any) => {        
        const url = search?.content?.url ? search?.content?.url : search?.content?.content_link; 
        if(!url){
            return '';
        }
        const matchingValue = Object.keys(LOGO_CONTENT_SOURCE_MAP).filter(e=>url.match(e));
        if (matchingValue && matchingValue.length > 0 ){

            const result = (LOGO_CONTENT_SOURCE_MAP as { [key: string]: any })[matchingValue[0]] ;
            return result;
        }else{
            return '';
        }
    }

    const fillCollectionDetail = async (contentId: string) => {

        setCollectionDetail(getCollection(contentId));
    }
    const getCollectionDetailFromEvent = async (event: any) => {

        setCollectionDetail({
                content_id: event.contentId,
                id: event.contentId,
                content:{
                    authors: event.authors,
                    content_body: event.contentBody,
                    content_link: event.url ? event.url : event.contentLink ? event.contentLink: '',
                    name: event.contentTitle,
                    content_type: event.contentType,
                    country: event.country,
                    curated_content_type: event.curatedContentType,
                    is_premium: event.isPremium,
                    main_genres: event.mainGenres,
                    reference_image_link: event.reference_image_link,
                    request_body: null,
                    response_body: null,
                    rss_feeds: event.rssFeeds,
                    source_link: event.sourceLink,
                    sub_genres: event.subGenres,
                    summary: event.summary,
                    url: event.url ? event.url : event.contentLink ? event.contentLink: ''
        
                }});



    }

    const getCollectionDetailFromLikedEntity = async (content: any) => {

        const cd = {
            content_id: content?.id,
            id: content?.id,
            content:{
                authors: content?.authors,
                content_body: content?.contentBody,
                content_link: content?.url ? content?.url : content?.contentLink ? content?.contentLink: '',
                name: content?.name,
                content_type: content?.contentType,
                country: content?.country,
                curated_content_type: content?.curatedContentType,
                is_premium: content?.isPremium,
                main_genres: content?.mainGenres,
                reference_image_link: content?.reference_image_link,
                request_body: null,
                response_body: null,
                rss_feeds: content?.rssFeeds,
                source_link: content?.sourceLink,
                sub_genres: content?.subGenres,
                summary: content?.summary,
                url: content?.url ? content?.url : content?.contentLink ? content?.contentLink: ''
            }
        };

        setCollectionDetail(cd);
                
    }    

    const wordScrolled = (e: any) => {

        const tempRef: any = ref.current;

        if (tempRef?.offsetHeight + tempRef?.scrollTop  >= tempRef?.scrollHeight) {
            setWordPageNumber(prev => prev + 1);
        }

    }

    const contentScrolled = (e: any) => {
        const tempRef: any = contentRef.current;
        if (tempRef.offsetHeight + tempRef.scrollTop + 200 >= tempRef.scrollHeight) {

            setContentPageNumber(prev => prev + 1);
        }
    }
    const accordionToggle = (e: any, index: number, innerIndex: number) => {

        const event = e.target.dataset.event;
        const copyCollapseArray = [...collapseArray] as any;
        copyCollapseArray[index][innerIndex] = collapseArray[index][innerIndex] === Number(event) ? 0 : Number(event);
        setCollapseArray(copyCollapseArray); 
    }


    const accordionToggleTab2 = (e: any, index: number, innerIndex: number) => {
        const event = e.target.dataset.event;
        const copyCollapseArrayTab2 = [...collapseArrayTab2] as any;
        
        copyCollapseArrayTab2[index][innerIndex] = collapseArrayTab2[index][innerIndex] === Number(event) ? 0 : Number(event);

        setCollapseArrayTab2(copyCollapseArrayTab2); 
    }


    const navToggle = (tab: any) => {
        if (activeTab !== tab) setActiveTab(tab);
    }



    useEffect(() => {
        fetchWords();
        fetchContents();
        //fetchDictionaries();
        const user: any = localStorage.getItem('currentUser');
        setCurrentUser(JSON.parse(user));
    }, []);

    useEffect(() => {
        if (wordPageNumber < wordPageCount) {
            fetchWords();
        }
    }, [wordPageNumber]);

    useEffect(() => {
        if (contentPageNumber < contentPageCount) {
            fetchContents();
        }
    }, [contentPageNumber]);

    useEffect(() => {
        if (contentReacting) {
            fetchContents();
        }
    }, [contentReacting]);

    useEffect(() => {
        if (wordReacting) {
            fetchWords();
        }
    }, [wordReacting]);


    const handleReact = async (word: any, wordId: any, contentId: any, domain: string) => {
        const body = {
            domain: domain === 'WORD' ? 'WORD' : 'CONTENT',
            event: 'UNLIKE',
            word: word,
            wordId: wordId,
            contentId: contentId
        }
        try {
            const result = await authAxios.post(`${process.env.REACT_APP_BASE_URL}/event`, body);
            alertContext.setSuccessAlert('The action was successfully completed');
            if (domain === 'WORD') {
                setWordReacting(true);
                setWordPageNumber(0);
                // setLikedWords([]);
                // fetchWords();
            } else {
                setContentReacting(true);
                setContentPageNumber(0);
                // setLikedContents([]);
                // fetchContents();
            }
        }
        catch (error) {
            const { response } = error;
            alertContext.setErrorAlert(response.data.message);
        }


        // localStorage.setItem('currentUserToken', result.data);
    }
    const handleSearch = async (contentId: string) => {
        const search: any = await getCollection(contentId);

        const searchFilterCriteria = {
            content: search?.content?.content_body ? search?.content?.content_body : null,
            contentId: contentId,
            url: search?.content?.url ? search?.content?.url : search?.content?.content_link ? search?.content?.content_link : null
        }
        localStorage.setItem('collectionFilterCriteria', JSON.stringify(searchFilterCriteria));
        history.push('/');
    }

    const handleMeaning = async (word: string) => {
        const url = `/meaning?w=` + word;
        window.open(url)
    }

    const handleAudio = async (word: string, line: string, accent: string) => {
        setAudioLoading(true);
        const encodedSentence = encodeURI(line);
        try {
            const result = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/filter/audio?sentence=${encodedSentence}&accent=${accent}&word=${word}`);
            setAudioLoading(false);
            audioRef.current.src = result.data;
            audioRef.current.play();
            setPlaying(true);
        } catch (error) {
            alertContext.setErrorAlert('Audio not found');
            setAudioLoading(false);
        }
    }
    const backFromDetail = () => {
        setTimeout(() => {
            fetchWords();
            fetchContents();

            setCollectionDetail({});
        }, 100);
    }

return (
<div style={{minHeight:'550px'}}>
  {Object.entries(collectionDetail).length === 0 && <div className="row bg-white py-5 newbox m-1">
    <div className="brands p-1  m-1 b-1">
      <Nav tabs>
        <NavItem>
          <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => { navToggle('1'); }} >
              Organized By Words
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => { navToggle('2'); }} >
              Organized By Contents
          </NavLink>
        </NavItem>                            
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
            <Row>
                <Col sm="12">

                    <div className="row bg-white  newbox p-0 m-0 b-0">
                        <div className="brands p-0 m-0 b-0">
                            <div className="box box-widget widget-user-2 p-0 m-0 b-0">

                                { (!likedWords || likedWords.length < 1) && wordsFetched && <ul className="products-list product-list-in-box p-0 m-0 b-0" onScroll={(e) => wordScrolled(e)} ref={ref} style={{ height: '100%', overflowY: 'auto' }}>
                                You haven't saved any word or sentence yet
                                </ul>

                                }

                                { likedWords && likedWords.length > 0 && <ul className="products-list   product-list-in-box p-0 m-0 b-0" onScroll={(e) => wordScrolled(e)} ref={ref} style={{ height: '100%', overflowY: 'auto' }}>
                                    {
                                        likedWords.map((item: any, index) => {

                                            return <Card key={index}  className="p-0 m-0 b-0">
                                                <CardHeader className="p-0 m-0 b-0"  >


                                                        <div className="d-flex justify-content-start p-0 m-0 b-0"   >

                                                            { item.likedEntities && item.likedEntities.filter((e: any)=>((e.sentences && e.sentences.length > 0) || e.content)).length>0 ? <div className="p-2"  data-event={index}>
                                                                <a onClick={(e) => { e.preventDefault(); accordionToggle(e,index,0) }} href="#" className="product-title" >

                                                                <FontAwesomeIcon style={{ fontSize: '26px' }} className="cursor-pointer pr-1 indigo" icon={ collapseArray && collapseArray[index] && collapseArray[index][0] === index ? faAngleUp : faAngleDown} data-event={index} />
                                                                </a>
                                                            </div>  : <div className="p-2" data-event={index}> <FontAwesomeIcon style={{ visibility: 'hidden' }} className="cursor-pointer pr-1 indigo" icon={ collapseArray && collapseArray[index] && collapseArray[index][0] === index ? faAngleUp : faAngleDown} /> </div> } 
                                                            

                                                            

                                                            <div className="d-flex flex-column flex-grow-1 p-0 m-0 b-0">

                                                                <div className="p-2 d-flex flex-grow-1  flex-row">
                                                                    <div className="p-2  mr-auto">
                                                                        <a onClick={() => { handleMeaning(item.languageWord); Event('SavedResources',"Clicked on Liked Word, Organized By Word ","Clicked on Liked Word, Organized By Word: "+item.languageWord) }} href="#" className="product-title">

                                                                        <FontAwesomeIcon style={{ fontSize: '24px' }} className="cursor-pointer pr-1 indigo" icon={faBook} />
                                                                        {item.languageWord}
                                                                        
                                                                    </a>

                                                                    {item.likedEntities && item.likedEntities.filter((e: any)=>(e.sentences && e.sentences.length > 0) || e.word).length && <p> (
                                                                          {item.likedEntities.filter((e: any)=>(e.sentences && e.sentences.length > 0) || e.word).length  > 1 ? item.likedEntities.filter((e: any)=>(e.sentences && e.sentences.length > 0) || e.word).length  + ' resources' : item.likedEntities.filter((e: any)=>(e.sentences && e.sentences.length > 0) || e.word).length  + ' resource'  }


                                                                         ) </p>}

                                                                    
                                                                        
                                                                    </div>

                                                                    <div className="p-2 ml-auto ">
                                                                    { !item.likedEntities || item.likedEntities.filter((e: any)=>e.content).length == 0 && <a className="cursor-pointer" onClick={() => { handleReact(item.languageWord, item.id, null, 'WORD'); Event('SavedResources',"Clicked on Liked Word, Organized By Word ","Clicked on Delete Liked Word, Organized By Word: "+item.languageWord)  }}>
                                                                            <p>
                                                                                <FontAwesomeIcon className="text-blue font-23" icon={faTrashAlt} />
                                                                            </p>
                                                                        </a>
                                                                    }
                                                                    </div>

                                                                </div>
                                                                        
                                                            </div>

                                                        </div>
                                                </CardHeader>
                                                <Collapse isOpen={collapseArray && collapseArray[index] ? collapseArray[index][0] === index: false} className="p-0 m-0 b-0">
                                                    <CardBody className="p-0 m-0 b-0">
                                                      <div className="d-flex flex-column p-0 m-0 b-0">

                                                          { item.likedEntities && item.likedEntities.filter((e: any)=>e.liked).length > 0 && item.likedEntities.filter((e: any)=>e.liked).map((innerItem: any, innerIndex: number) => {

                                                            return  (innerItem.content || (innerItem.sentences && innerItem.sentences.length > 0)) && <Card key={innerIndex}  className="p-0 m-0 b-0">
                                                            <CardHeader className="m-0 b-0 pb-0"  >


                                                                    <div className="d-flex justify-content-start p-0 m-0 b-0"   >

                                                                        <div className="p-2"  >
                                                                          <a onClick={e=>{e.preventDefault(); accordionToggle(e,index,innerIndex+1 )}} href="#" className="product-title" >
                                                                            <FontAwesomeIcon style={{ fontSize: '24px' }} className="cursor-pointer pr-1 indigo" icon={ (collapseArray && collapseArray[index] && collapseArray[index][innerIndex+1] === innerIndex+1) ? faAngleUp : faAngleDown } data-event={innerIndex+1} />
                                                                          </a> 
                                                                        </div>

                                                                        <div className="d-flex flex-column flex-grow-1 p-0 m-0 b-0">

                                                                            <div className="p-2 d-flex flex-grow-1  flex-row">
                                                                                <div className="p-2  mr-auto">
                                                                                    <a style={{ width: '100%' }} onClick={() => {getCollectionDetailFromLikedEntity(innerItem.content); Event('SavedResources',"Clicked on Collection Details, Organized By Word ","Clicked on Collection Details, Organized By Word content id: "+innerItem.content.id)}} className="product-title cursor-pointer d-flex">
                                                                                    <p style={{  }} className="contentTextWide">{innerItem?.content?.contentBody}</p>
                                                                                    
                                                                                </a>
                                                                                    {innerItem.sentences && ( innerItem.sentences.length > 1 ? <p> ({innerItem.sentences.length} sentences) </p>  : <p> ({innerItem.sentences.length} sentence) </p>)}




                                                                                </div>

                                                                                <div className="p-2 ">
                                                                                    
                                                                                </div>

                                                                                <div className="p-2 ml-auto ">
                                                                                    <a className="cursor-pointer" onClick={() => { handleReact(item.languageWord ,item.id, innerItem?.content?.id, 'WORD'); Event('SavedResources',"Clicked on Delete Liked Word, Organized By Word ","Clicked on Delete Liked Word, Organized By Word word: "+item.languageWord) }}>
                                                                                        <p>
                                                                                            <FontAwesomeIcon className="text-blue font-23" icon={faTrashAlt} />
                                                                                        </p>
                                                                                    </a>
                                                                                </div>

                                                                            </div>

                                                                            <div className="d-flex mb-auto ">
                                                                            
                                                                            </div>                                                                                    
                                                                        </div>

                                                                    </div>

                                                            </CardHeader>
                                                            <Collapse isOpen={collapseArray && collapseArray[index]? collapseArray[index][innerIndex+1] === innerIndex+1: false} className="m-0 b-0 pl-5">
                                                                <CardBody className="m-0 b-0">
                                                                  <div className="d-flex flex-column m-0 b-0 p-0">

                                                                      { innerItem.sentences && innerItem.sentences.length > 0 && innerItem.sentences.map((sentence: any, sentenceIndex: number) => {

                                                                        return <p>
                                                                                <button className="filterButton" onClick={() => { handleAudio(item.languageWord, sentence, 'Joanna_English_US'); Event('SavedResources',"Clicked on Play Audio, Organized By Word ","Clicked on Play Audio, Organized By Word sentence: "+sentence)  }}>
                                                                                    {!audioLoading &&
                                                                                        <FontAwesomeIcon icon={faVolumeUp} />
                                                                                    }
                                                                                    {audioLoading &&
                                                                                        <FontAwesomeIcon className="loading-icon" icon={faSpinner} />
                                                                                    }
                                                                                </button> {sentence}
                                                                        </p>

                                                                      })


                                                                      }
                                                                  

                                                                  </div>

                                                                </CardBody>
                                                            </Collapse>
                                                            </Card>

                                                          })

                                                          }                                                      
                                                      </div>

                                                    </CardBody>
                                                </Collapse>
                                            </Card>

                                        })
                                    }

                                </ul>
                                }
                            </div>
                        </div>

                    </div>

                </Col>
            </Row>
        </TabPane>


          <TabPane tabId="2">
              <Row>
                  <Col sm="12">

                      <div className="row bg-white row bg-white  newbox p-0 m-0 b-0">
                          <div className="brands p-0 m-0 b-0">
                              <div className="box box-widget widget-user-2 p-0 m-0 b-0">

                                  { (!likedContents || likedContents.length < 1) && contentFetched && <ul className="products-list product-list-in-box p-0 m-0 b-0" onScroll={(e) => contentScrolled(e)} ref={contentRef} style={{ height: '100%', overflowY: 'auto' }}>
                                  You haven't saved any content yet
                                  </ul>

                                  }



                                  {likedContents && likedContents.length > 0 && <ul className="products-list product-list-in-box p-0 m-0 b-0" onScroll={(e) => contentScrolled(e)} ref={contentRef} style={{ height: '100%', overflowY: 'auto' }}>
                                      {
                                          likedContents.map((item: any,index: number) => {



                                              return <Card key={index} className="p-0 m-0 b-0">
                                                  <CardHeader className="p-0 m-0 b-0"  >


                                                          <div className="d-flex justify-content-start p-0 m-0 b-0"   >

                                                              { item.likedEntities && item.likedEntities.filter((e: any)=>((e.sentences && e.sentences.length > 0) || e.word)).length>0 ? <div className="p-2" >
                                                                <a onClick={e=>{e.preventDefault(); accordionToggleTab2(e,index, 0)}} data-event={index} href="#" className="product-title" data-custom={index}>

                                                                  <FontAwesomeIcon style={{ fontSize: '26px' }} className="cursor-pointer pr-1 indigo" icon={ collapseArrayTab2 && collapseArrayTab2[index] && collapseArrayTab2[index][0] === index ? faAngleUp : faAngleDown} data-event={index}  />
                                                                </a>  
                                                              </div>  : <div className="p-2" data-event={index}> <FontAwesomeIcon style={{ visibility: 'hidden' }} className="cursor-pointer pr-1 indigo" icon={ collapseArrayTab2 && collapseArrayTab2[index] && collapseArrayTab2[index][0] === index ? faAngleUp : faAngleDown} /> </div> } 
                                                              
                                                              

                                                              <div className="d-flex flex-column flex-grow-1 p-0 m-0 b-0">

                                                                  <div className="p-2 d-flex flex-grow-1  flex-row">
                                                                      <div className="p-2  mr-auto flex-grow-1">
                                                                          <a onClick={() => { getCollectionDetailFromLikedEntity(item); Event('SavedResources',"Clicked on Details Content, Organized By Content ","Clicked on Details Content, Organized By Content, content.id: "+item?.id) }} href="#" className="product-title">

                                                                          

                                                                          <p className="d-flex justify-content-start  "  style={{display:'inline'  }}  >

                                                                              <p  className="contentTextWide">{item?.contentBody} </p>
                                                                              {/*<span>...</span>*/}
                                                                          </p>
                                                                          
                                                                         </a>
                                                                        
                                                                         {item.likedEntities && item.likedEntities.filter((e: any)=>((e.sentences && e.sentences.length > 0) || e.word)).length>0 &&  <p> (
                                                                          {item.likedEntities.filter((e: any)=>((e.sentences && e.sentences.length > 0) || e.word)).length > 1 ? item.likedEntities.filter((e: any)=>((e.sentences && e.sentences.length > 0) || e.word)).length + ' words' : item.likedEntities.filter((e: any)=>((e.sentences && e.sentences.length > 0) || e.word)).length + ' word'  }


                                                                         ) </p>}
                                                                         
                                                                      </div>

                                                                      

                                                                      <div className="p-2 ml-auto ">
                                                                          <a className="cursor-pointer" onClick={() => { handleReact(null, null, item.id, 'CONTENT'); Event('SavedResources',"Clicked on Delete Liked Content, Organized By Content ","Clicked on Delete Liked Content, Organized By Content, content.id: "+item?.id) }}>
                                                                              <p>
                                                                                  <FontAwesomeIcon className="text-blue font-23" icon={faTrashAlt} />
                                                                              </p>
                                                                          </a>
                                                                         
                                                                      </div>

                                                                  </div>

                                                                  {/* item.likedEntities && item.likedEntities.length >0 && <div className="d-flex .mb-auto ">
                                                                      Saved in {item.likedEntities.length} {item.likedEntities.length > 1 ? 'texts' : 'text' } 
                                                                  </div>*/}                                                                                   

                                                              </div>
                                                          </div>
                                                  </CardHeader>                                                  

                                                  <Collapse isOpen={ collapseArrayTab2 && collapseArrayTab2[index] ? collapseArrayTab2[index][0] === index: false} className="p-0 m-0 b-0">
                                                      <CardBody className="p-0 m-0 b-0">
                                                        <div className="d-flex flex-column p-0 m-0 b-0">

                                                            { item.likedEntities && item.likedEntities.length > 0 && item.likedEntities.map((innerItem: any, innerIndex: number) => {







                                                              return  ((innerItem.word && innerItem.liked ) || (innerItem.sentences && innerItem.sentences.length > 0)) && <Card key={innerIndex} className="p-0 m-0 b-0">                                                              
                                                              <CardHeader className="m-0 b-0 pb-0"  >


                                                                      <div className="d-flex justify-content-start mb-3"   >

                                                                          <div className="p-2"  >
                                                                            <a onClick={e=>{e.preventDefault(); ; accordionToggleTab2(e,index,innerIndex+1 )}} data-event={index} href="#" className="product-title" data-custom={index}>
                                                                              <FontAwesomeIcon style={{ fontSize: '24px' }} className="cursor-pointer pr-1 indigo" icon={ (collapseArrayTab2 && collapseArrayTab2[index] && collapseArrayTab2[index][innerIndex+1] === innerIndex+1) ? faAngleUp : faAngleDown } data-event={innerIndex+1} />
                                                                            </a>
                                                                          </div>

                                                                          <div className="d-flex flex-column flex-grow-1">

                                                                              <div className="p-2 d-flex flex-grow-1  flex-row">
                                                                                  <div className="p-2  mr-auto">
                                                                                      <a style={{ width: '100%' }} onClick={() => {handleMeaning(innerItem?.word?.languageWord); Event('SavedResources',"Clicked on Word Definition, Organized By Content ","Clicked on Word Definition, Organized By Content, word: "+innerItem?.word?.languageWord);} } className="product-title cursor-pointer d-flex">
                                                                                      <p style={{  }} className="contentTextWide">{innerItem?.word?.languageWord}</p>
                                                                                      
                                                                                  </a>
                                                                                      {innerItem.sentences && ( innerItem.sentences.length > 1 ? <p> ({innerItem.sentences.length} sentences) </p>  : <p> ({innerItem.sentences.length} sentence) </p>)}




                                                                                  </div>

                                                                                  <div className="p-2 ">
                                                                                      
                                                                                  </div>

                                                                                  <div className="p-2 ml-auto ">
                                                                                      {/* button to delete instance*/}
                                                                                  </div>

                                                                              </div>

                                                                              <div className="d-flex .mb-auto ">
                                                                              
                                                                              </div>                                                                                    
                                                                          </div>

                                                                      </div>

                                                              </CardHeader>
                                                              <Collapse isOpen={collapseArrayTab2 && collapseArrayTab2[index]? collapseArrayTab2[index][innerIndex+1] === innerIndex+1: false}  className="m-0 b-0 pl-5">
                                                                  <CardBody className="m-0 b-0">
                                                                    <div className="d-flex flex-column m-0 b-0">

                                                                        { innerItem.sentences && innerItem.sentences.length > 0 && innerItem.sentences.map((sentence: any, sentenceIndex: number) => {

                                                                          return <p>
                                                                                  <button className="filterButton" onClick={() => { handleAudio(item.languageWord, sentence, 'Joanna_English_US'); Event('SavedResources',"Clicked on Play Audio, Organized By Content ","Clicked on Play Audio, Organized By Content, sentence: "+sentence)  }}>
                                                                                      {!audioLoading &&
                                                                                          <FontAwesomeIcon icon={faVolumeUp} />
                                                                                      }
                                                                                      {audioLoading &&
                                                                                          <FontAwesomeIcon className="loading-icon" icon={faSpinner} />
                                                                                      }
                                                                                  </button> {sentence}
                                                                          </p>

                                                                        })


                                                                        }
                                                                    

                                                                    </div>


                                                                      {/*item.likedEntities && item.likedEntities.length > 0 && item.likedEntities[0].sentences && item.likedEntities[0].sentences.map((sentence: any, indexSentence: number) => {
                                                                              return <p>
                                                                                  <button className="filterButton" onClick={() => { handleAudio(item.languageWord, sentence, 'Joanna_English_US') }}>
                                                                                      {!audioLoading &&
                                                                                          <FontAwesomeIcon icon={faVolumeUp} />
                                                                                      }
                                                                                      {audioLoading &&
                                                                                          <FontAwesomeIcon className="loading-icon" icon={faSpinner} />
                                                                                      }
                                                                                  </button> {sentence}
                                                                              </p>
                                                                          })
                                                                      */}

                                                                  </CardBody>
                                                              </Collapse>
                                                              </Card>
                                                              












                                                            })


                                                            }
                                                        

                                                        </div>


                                                          {/*item.likedEntities && item.likedEntities.length > 0 && item.likedEntities[0].sentences && item.likedEntities[0].sentences.map((sentence: any, indexSentence: number) => {
                                                                  return <p>
                                                                      <button className="filterButton" onClick={() => { handleAudio(item.languageWord, sentence, 'Joanna_English_US') }}>
                                                                          {!audioLoading &&
                                                                              <FontAwesomeIcon icon={faVolumeUp} />
                                                                          }
                                                                          {audioLoading &&
                                                                              <FontAwesomeIcon className="loading-icon" icon={faSpinner} />
                                                                          }
                                                                      </button> {sentence}
                                                                  </p>
                                                              })
                                                          */}

                                                      </CardBody>
                                                  </Collapse>
                                              </Card>




                                          })
                                      }
                                  </ul>
                                  }

                              </div>
                          </div>

                      </div>





                  </Col>
              </Row>
          </TabPane>
          
      </TabContent>
    </div>
      </div>}


    {Object.entries(collectionDetail).length !== 0 && <CollectionDetail source={'settings'} collection={collectionDetail} runSearch={(contentId: string) => { handleSearch(contentId) }} typeCollection="collection"  logo={getLogo(collectionDetail)} backFromSavedDetail={backFromDetail} />}
    <audio ref={audioRef} style={{ display: 'none' }}></audio>
</div>
)
}
