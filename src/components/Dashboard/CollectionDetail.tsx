import React, { useState, useRef, useCallback, useEffect, useContext } from 'react'
import { EsInteraction } from '../../context/types';
import { authAxios } from '../../api/authApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../assets/images/spinner.svg';
import { AlertContext } from '../../context/alert/AlertContextProvider';
import { LOGO_CONTENT_SOURCE_MAP, URL_PLACE_HOLDER, CONTENT_PLACE_HOLDER } from '../../constants';

const CollectionDetail = (props: any) => {

    const collection: EsInteraction = props.collection;

    console.log("CollectionDetail logo:" + props.logo);
    console.log(props);

    const source = props.source;
    const hideLoader = props.hideLoader;
    const [fullText, setfullText] = useState(false);
    const [fullTextLoading, setFullTextLoading] = useState(false);
    const ref = useRef(null);
    const [currentText, setCurrentText] = useState('');
    const [lastCharIndex, setLastCharIndex] = useState(0);
    const alertContext = useContext(AlertContext)



    const handleReact = async (contentId: string, type: string) => {
        const body = {
            domain: 'CONTENT',
            event: type === 'like' ? 'LIKE' : 'UNLIKE',
            contentId: contentId
        }
        try {
            const result = await authAxios.post(`${process.env.REACT_APP_BASE_URL}/event`, body);
            //alertContext.setSuccessAlert(result.data);
            alertContext.setSuccessAlert('The action was successfully completed');
        } catch (error) {
            const { res } = error;
            alertContext.setErrorAlert(res.data.message);
        }
    }

    const handleFullText = () => {
        setFullTextLoading(true);
        setTimeout(() => {
            setfullText(true);
        }, 100);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        if (hideLoader) {
            hideLoader();
        }
    }, [])

    const scrolled = (e: any) => {
        const tempRef: any = ref.current;
        if (tempRef.offsetHeight + tempRef.scrollTop >= tempRef.scrollHeight) {
            updateText();
        }
    }

    const updateText = () => {
        if (collection && collection?.content?.content_body && lastCharIndex < collection?.content?.content_body.length) {
            if (collection?.content?.content_body.length > 1000) {
                setCurrentText(currentText + collection?.content?.content_body.substr(lastCharIndex, 1000));
                setLastCharIndex(lastCharIndex + 1000)
            } else {
                setCurrentText(currentText + collection?.content?.content_body.substr(lastCharIndex, collection?.content?.content_body.length));
                setLastCharIndex(lastCharIndex + (collection?.content?.content_body.length - lastCharIndex))
            }
        }
    }


    useEffect(() => {
        if (collection?.content?.content_body) {
            updateText();
        }
    }, []);

    return (
        <div className="row bg-white py-5 newbox m-25">
            <div className="col-lg-3"> 
                <div className="box box-primary">
                    <div className="card  text-center">

                        {(collection?.content?.url || collection?.content?.content_link) && <a target="_blank" href={collection?.content?.url ? collection?.content?.url : collection?.content?.content_link ? collection?.content?.content_link : '#'}> <img className="card-img-top img-responsive" src={collection?.content?.reference_image_link ? collection?.content?.reference_image_link : props.logo ? props.logo : URL_PLACE_HOLDER ? URL_PLACE_HOLDER : CONTENT_PLACE_HOLDER} alt="Card image cap" style={{ width: '100%', minHeight: '250px' }} /> </a>
                        }
                        {!collection?.content?.url && !collection?.content?.content_link && <img className="card-img-top img-responsive" src={collection?.content?.reference_image_link ? collection?.content?.reference_image_link : props.logo ? props.logo : URL_PLACE_HOLDER ? URL_PLACE_HOLDER : CONTENT_PLACE_HOLDER} alt="Card image cap" style={{ width: '100%', minHeight: '250px' }} />
                        }
                        <div className="card-body align-items-center justify-content-center d-flex flex-column">
                            {collection?.content?.content_type !== 'ContentEntity' && <h4 className="card-title">{collection?.content?.name}</h4>}
                            {collection?.content?.content_body && <p className="contentText">{collection?.content?.content_body}</p>}
                            <div>
                                {source === 'collection' && <a className="cursor-pointer" onClick={() => { handleReact(collection?.content.id, 'like') }}>
                                    <FontAwesomeIcon icon={faThumbsUp} className="text-blue font-24 mr-3" data-toggle="tooltip" data-placement="bottom" title="Like and save to review later" />
                                </a>}

                                {/*(source === 'collection' || source === 'settings') && <a className="cursor-pointer" onClick={() => { handleReact(collection?.content?.id, 'unlike') }}>
                                    <FontAwesomeIcon icon={faThumbsDown} className="text-blue font-24" />
                                </a>*/}
                            </div>
                            <div className="d-flex center pt-2 justify-content-center">
                                <div className="ml-1">
                                    <button onClick={() => { props.runSearch(props.typeCollection == 'search' ? collection.id : collection.content_id) }} className="btn btn-primary mybtn">Run Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-9">
                <div className="box box-primary px-3 pb-2">
                    <h3 className="text-blue text-bold font-24">{collection?.content?.name}</h3>
                    <hr />
                    <ul className="nav nav-stacked sty1">
                        {(collection?.content?.url || collection?.content?.content_link) &&
                            <li className="d-flex justify-content-between">
                                <p>
                                    <span className="text-blue font-weight-bold">Link: </span>
                                    <span className="pull-right text-left font-weight-bold">
                                        <a target="_blank" href={collection?.content?.url ? collection?.content?.url : collection?.content?.content_link ? collection?.content?.content_link : 'Invalid Link'}>Open Original Content</a>
                                    </span>
                                </p>
                                <button className="btn btn-sm text-white btn-primary px-4" onClick={source === 'collection' ? props.backFromDetail : source === 'search' ?  props.backFromSearchDetail : props.backFromSavedDetail}>Back</button>
                            </li>}
                        <li>
                            <p>
                                <span className="text-blue font-weight-bold">Type: </span>
                                <span className="pull-right text-left font-weight-bold">
                                    {collection?.content?.content_type === 'ContentEntity' ? 'Text' : collection?.content?.curated_content_type}
                                </span>
                            </p>
                        </li>


                        <li>
                            <div>
                                <span className="text-blue font-weight-bold">Contents: </span>
                                <br />
                                <p onScroll={(e) => scrolled(e)} ref={ref} style={{ height: '280px', overflowY: 'scroll', display: !fullText ? 'block' : 'none' }} className="text-left font-weight-bold">
                                    {
                                        currentText
                                    }
                                    {/* {collection?.content?.content_body.substr(0, 300)} <span className="text-primary cursor-pointer"
                                        onClick={() => { handleFullText() }}>Read More...</span> */}
                                </p>

                                {/* {fullTextLoading && <div className="d-flex justify-content-center align-items-center">
                                    <img className="mx-auto text-center" src={Spinner} />
                                </div>} */}
                                {/* <span ref={onRefChange} className="pull-right text-left font-weight-bold" style={{ visibility: fullText ? 'visible' : 'hidden' }}>
                                    {collection?.content?.content_body.substr(0, 300) + collection?.content?.content_body.substr(301, 600)}
                                </span> */}
                            </div>
                        </li>


                        {collection?.content?.main_genres && <li>
                            <p>
                                <span className="text-blue">Main Genre: </span>
                                {collection?.content?.main_genres && <span className="pull-right text-left">{collection?.content?.main_genres}</span>}
                            </p>
                        </li>}
                        {collection?.content?.sub_genres && <li>
                            <p>
                                <span className="text-blue">Sub Genres: </span>
                                {collection?.content?.sub_genres && <span className="pull-right text-left">{collection?.content?.sub_genres.join(' ')}</span>}
                            </p>
                        </li>}
                        {collection?.content?.summary && <li>
                            <p>
                                <span className="text-blue">Summary: </span>
                                <span className="pull-right text-left">
                                    {collection?.content?.summary}</span>
                            </p>
                        </li>}
                        {collection?.content?.country && <li>
                            <p>
                                <span className="text-blue">Country: </span>
                                <span className="pull-right text-left">{collection?.content?.country}</span>
                            </p>
                        </li>}
                        {collection?.content?.source_link && <li>
                            <p>
                                <span className="text-blue">Source Link: </span>
                                <span className="pull-right text-left text-light-blue">{collection?.content?.source_link}</span>
                            </p>
                        </li>}
                        {/* <li>
                            <p>
                                <span className="text-blue">Content Link: </span>
                                <span className="pull-right text-left text-light-blue">{collection_link }</span>
                            </p>
                        </li> */}

                        {collection?.content?.publication_date && <li>
                            <p>
                                <span className="text-blue">Published on: </span>
                                <span className="pull-right text-left">{collection?.content?.publication_date}</span>
                            </p>
                        </li>}
                        {/* <li>
                            <p>
                                <span className="text-blue">Established on: </span>
                                <span className="pull-right text-left">30 Oct 2017</span>
                            </p>
                        </li> */}
                        {collection?.content?.rss_feeds && <li>
                            <p>
                                <span className="text-blue">RSS Feeds: </span>
                                {collection?.content?.rss_feeds && <span className="pull-right text-left">{collection?.content?.rss_feeds.join(' ')}</span>}
                            </p>
                        </li>}
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default CollectionDetail;