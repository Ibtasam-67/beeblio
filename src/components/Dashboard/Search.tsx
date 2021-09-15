import React, { useState, useEffect, useRef, Fragment } from 'react';
import SearchIcon from '../../assets/images/dashboard/01.png';
import { authAxios } from '../../api/authApi';
import CollectionDetail from './CollectionDetail';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../assets/images/spinner.svg';
import useFullPageLoader from '../../hooks/FullPageLoader';
import { LOGO_CONTENT_SOURCE_MAP, URL_PLACE_HOLDER } from '../../constants';
import { Event, SetDimension, InitAndPageViewGA } from "../../components/Tracking";
import ReactGA from 'react-ga';
import ReactPaginate from 'react-paginate';

const initialStat = {
    totalContentSearched: 0,
    totalUrlSearched: 0,
    totalContentCollected: 0,
    totalWordCollected: 0,
    totalSentencesCollected: 0
}

const Search = () => {

    //const urlParams = new URLSearchParams(window.location.search);
    //const initialSearchString = urlParams.get('s')
    const [stat, setStat] = useState(initialStat);
    const [searches, setSearches] = useState([]);
    const [pageCountArray, setPageCountArray] = useState(['']);
    const [pageNumber, setPageNumber] = useState(0);
    const [collectionDetail, setCollectionDetail] = useState({});
    const [searchString, setSearcheString] = useState('');
    const searchRef: any = useRef(null);
    const history = useHistory();
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [fetching, setFetching] = useState(true);

    const user: any = localStorage.getItem('currentUser');
    //setCurrentUser();

    const [currentUser, setCurrentUser] = useState(JSON.parse(user));
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [totalCount, setTotalCount] = useState(0);
    // const pageSize = 20;
    const getStat = async () => {
        const reuslt = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/user/statistics`);
        setStat(reuslt.data);
    }

    const getSearch = async (interactionId: string) => {
        let result: any = null;


        //result = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/interactions/${interactionId}`);

        result = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/search?entity=interaction&excludeFields=response_body,content.content_body&id=${interactionId}`);
        return (result && result.data && result.data.results && result.data.results.length > 0) ? result.data.results[0] : {};
    }

    const getSearches = async () => {
        setFetching(true);
        let result: any = null;
        setSearches([]);
        // const offsetToUse = pageNumber * pageSize;
        if (searchString === '') {
            //result = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/interactions?page=${pageNumber}`);

            result = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/search?entity=interaction&excludeFields=response_body,content.content_body&limit=${limit}&offset=${offset}&user_id=${currentUser.id}&order=desc`);
            setFetching(false);
        } else {
            //result = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/interactions?page=${pageNumber}&searchString=${searchString}`);

            result = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/search?entity=interaction&excludeFields=response_body&valueInAnyField=${searchString}&limit=${limit}&offset=${offset}&user_id=${currentUser.id}&order=desc`);

            setFetching(false);
        }
        setSearches(result.data.results);
        setTotalCount(result.data.totalCount);

        // if (result.data.totalCount > 0) {
        //     const nbElements = Math.ceil((+result.data.totalCount / pageSize));
        //     setPageCountArray(Array(nbElements).fill(''));
        //     setSearches(result.data.results);

        // } else {
        //     setPageCountArray([]);
        // }

    }

    const handleDetail = async (interactionId: string) => {
        const fn: any = showLoader;
        fn();
        const detail = await getSearch(interactionId);
        setCollectionDetail(detail);
    }

    const handleSearch = async (interactionId: string) => {

        const search: any = await getSearch(interactionId);
        const searchFilterCriteria = {
            content: search?.content?.content_body ? search?.content?.content_body : null,
            filterLimit: search?.frequency_limit,
            sorting: search.filter_sorting,
            contentId: search?.content?.curated_content_type ? search.content_id : null,
            url: search?.content?.url ? search?.content?.url : search?.content?.content_link ? search?.content?.content_link : null
        }
        localStorage.setItem('searchedFilterCriteria', JSON.stringify(searchFilterCriteria));
        history.push('/');
    }

    const getLogo = (search: any) => {
        const url = search?.content?.url ? search?.content?.url : search?.content?.content_link;
        if (!url) {
            return '';
        }
        const matchingValue = Object.keys(LOGO_CONTENT_SOURCE_MAP).filter(e => url.match(e));
        if (matchingValue && matchingValue.length > 0) {

            const result = (LOGO_CONTENT_SOURCE_MAP as { [key: string]: any })[matchingValue[0]];

            return result;
        } else {
            return '';
        }
    }
    useEffect(() => {
        const user: any = localStorage.getItem('currentUser');
        setCurrentUser(JSON.parse(user));
    }, []);

    useEffect(() => {
        getStat();
    }, []);

    useEffect(() => {
        getSearches();
    }, [pageNumber]);

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            getSearches();
        }
    }

    const handleHideLoader = () => {
        const fn: any = hideLoader;
        fn();
    }

    const backFromDetail = () => {
        setSearcheString('');
        setTimeout(() => {
            getSearches();
            setCollectionDetail({});
        }, 100);
    }

    useEffect(() => {
        getSearches();
    }, [offset]);

    const handlePageClick = (data: any) => {
        let selected = data.selected;
        // let offset = Math.ceil(selected * this.props.perPage);

        // this.setState({ offset: offset }, () => {
        //   this.loadCommentsFromServer();
        // });
        setOffset(selected * 20);
    };


    return (
        <div style={{ minHeight: '550px' }}>
            {loader}
            {Object.entries(collectionDetail).length === 0 && <div className="content m-25">
                <div className="bg-white py-5 newbox">
                    <div className=" search-box margin0auto">
                        <div className="search-form">
                            <div className="input-group">
                                <input name="search" onKeyDown={handleKeyDown} ref={searchRef} value={searchString} className="form-control" placeholder="Search here..." type="text" onChange={(e) => { setSearcheString(e.target.value) }} />
                                <span className="input-group-btn">
                                    <button name="search" id="search-btn" className="btn btn-flat" onClick={() => { getSearches(); Event('Search', "Clicked on 'Search' ", "Clicked on 'Search' ") }}>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 m-t-3 px-5">
                            <div className="box bg-white bordered pad-20">
                                <div className="inner">
                                    <div className="row m-b-2">
                                        <div className="col">
                                            <span className="info-box-text">Contents Filtered</span>
                                            <img src={SearchIcon} />
                                        </div>
                                        <div className="col pt-5">
                                            <h1 className="text-right text-blue text-bold">
                                                <sup><FontAwesomeIcon icon={faArrowUp} /></sup>
                                                {stat?.totalContentSearched}</h1>
                                        </div>
                                    </div>

                                    <div className="m-b-2">
                                        {/* <div className="progress bg-lightblue">
                                            aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"
                                            <div className="progress-bar bg-yellow" role="progressbar" style={{ width: "35%", height: "6px" }}></div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 m-t-3 px-5">
                            <div className="box bg-white bordered pad-20">
                                <div className="inner">
                                    <div className="row m-b-2">
                                        <div className="col">
                                            <span className="info-box-text">Sentences Saved</span>
                                            <img src={SearchIcon} />
                                        </div>
                                        <div className="col pt-5">
                                            <h1 className="text-right text-blue text-bold">
                                                <sup><FontAwesomeIcon icon={faArrowUp} /></sup>
                                                {stat?.totalSentencesCollected}</h1>
                                        </div>
                                    </div>

                                    <div className="m-b-2">
                                        {/* <div className="progress bg-lightblue">
                                            aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"
                                            <div className="progress-bar bg-green" role="progressbar" style={{ width: "35%", height: "6px" }} ></div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(!searches || (searches && searches.length === 0)) && fetching && <div className="d-flex justify-content-center align-items-center">
                        <img className="mx-auto text-center" src={Spinner} />
                    </div>}
                    {searches && searches.length > 0 && <div className="d-flex justify-content-center flex-wrap py-5 px-5">
                        {searches.map((search: any, index: number) => {
                            return <div key={index} className="m-b-3 mr-2" >
                                <div className="card text-center collectionCard" style={{ height: '100%' }}>

                                    {(getLogo(search) || search?.content?.reference_image_link || search?.content?.url) ? <img width="50px" height="250px" className="m-auto pt-2" src={getLogo(search) ? getLogo(search) : search?.content?.reference_image_link ? search?.content?.reference_image_link : search?.content?.url} alt="Card image cap" style={{ width: '100%', objectFit: 'contain' }} /> :

                                        <img width="50px" height="250px" className="m-auto pt-2" src={'https://wps2.beebl.io/public/file-alt.svg'} alt="Card image cap" style={{ width: '100%', objectFit: 'contain' }} />
                                    }


                                    <div className="card-body align-items-center justify-content-center d-flex flex-column">
                                        <div style={{ height: '100px' }}>
                                            <h4 className="card-title">{search?.content?.name ? search?.content?.name.substr(0, 16) : getLogo(search) ? 'News Article' : 'Internet Content'}</h4>
                                            {search?.content?.content_body && <p className="contentText">{search?.content?.content_body}</p>}
                                        </div>
                                        <div className="d-flex center pt-2 justify-content-center">
                                            <div className="mr-1">
                                                <button className="btn btn-primary mybtn" onClick={() => { handleDetail(search.id); Event('Search', "Clicked on 'View Details' ", "Clicked on 'View Details' for content: " + search.id) }}>View Details</button>
                                            </div>
                                            <div className="ml-1">
                                                <button onClick={() => { handleSearch(search.id); Event('Search', "Clicked on 'Run Search' ", "Clicked on 'Run Search' for content: " + search.id) }} className="btn btn-primary mybtn">Run Search</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>}
                    {/* {pageCountArray.length > 1 && <div className="flex-center">
                        <ul className="pagination">
                            <li className={"paginate_button previous " + (pageNumber === 0 ? 'disabled' : '')} id="example1_previous" >
                                <button onClick={() => { if (pageNumber > 0) { setPageNumber(+(pageNumber - 1)); Event('Search',"Clicked on 'Page number' ","Clicked on 'Page number'"+(pageNumber - 1)) } }} aria-controls="example1" data-dt-idx="0" disabled={pageNumber === 0 ? true : false}>Previous</button>
                            </li>
                            {
                                pageCountArray.map((page, index) => {
                                    return <li key={index} className={"paginate_button " + (pageNumber === index ? 'active' : '')}>
                                        <button onClick={() => { setPageNumber(+(index)); Event('Search',"Clicked on 'Page number' ","Clicked on 'Page number'"+(index)) }} aria-controls="example1" data-dt-idx="1">{index + 1}</button>
                                    </li>
                                })
                            }
                            <li className={"paginate_button next " + (pageNumber === pageCountArray.length ? 'disabled' : '')} id="example1_next">
                                <button onClick={() => { if (pageNumber < pageCountArray.length) { setPageNumber(+(pageNumber + 1)); Event('Search',"Clicked on 'Page number' ","Clicked on 'Page number'"+(pageNumber + 1)) } }} aria-controls="example1" disabled={pageNumber === pageCountArray.length ? true : false}>Next</button>
                            </li>
                        </ul>
                    </div>} */}
                    <div className="d-flex align-items-center justify-content-center">
                        <ReactPaginate
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={'...'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                            containerClassName={'pagination'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            activeClassName={'active'}
                            pageCount={Math.ceil(totalCount / limit)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                        />
                    </div>
                </div >
            </div >}
            {
                Object.entries(collectionDetail).length !== 0 &&
                <Fragment>
                    {/* <button className="btn btn-primary ml-auto" onClick={() => { setCollectionDetail({}) }}>Back</button> */}
                    <CollectionDetail backFromSearchDetail={backFromDetail} hideLoader={handleHideLoader} collection={collectionDetail} runSearch={(interactionId: string) => { handleSearch(interactionId) }} typeCollection="search" logo={getLogo(collectionDetail)} />
                </Fragment>
            }
        </div >
    );
};

export default Search;