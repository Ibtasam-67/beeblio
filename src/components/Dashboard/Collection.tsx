import React, { useState, useEffect, useRef, useContext } from 'react';
import CollectionDetail from './CollectionDetail';
import { authAxios } from '../../api/authApi';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../assets/images/spinner.svg';
import useFullPageLoader from '../../hooks/FullPageLoader';
import { AlertContext } from '../../context/alert/AlertContextProvider';
import { LOGO_CONTENT_SOURCE_MAP, URL_PLACE_HOLDER, CONTENT_PLACE_HOLDER } from '../../constants';
import { Event, SetDimension, InitAndPageViewGA } from "../../components/Tracking";
import ReactGA from 'react-ga';
import ReactPaginate from 'react-paginate';

const Collection = () => {
    const [collectionDetail, setCollectionDetail] = useState({});
    const [pageCountArray, setPageCountArray] = useState(['']);
    const [pageNumber, setPageNumber] = useState(0);
    const [searches, setSearches] = useState([]);
    const [searchString, setSearcheString] = useState('');
    const searchRef: any = useRef(null);
    const history = useHistory();
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [fetching, setFetching] = useState(true);
    const alertContext = useContext(AlertContext);
    const user: any = localStorage.getItem('currentUser');
    // const pageSize = 20;
    const [currentUser, setCurrentUser] = useState(JSON.parse(user));
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [totalCount, setTotalCount] = useState(0);

    const getSearches = async () => {
        setFetching(true);
        let result: any = null;
        setSearches([]);
        // const offsetToUse = pageNumber * pageSize;
        if (searchString === '') {
            result = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/search?user_id=${currentUser.id}&entity=interaction&excludeFields=response_body,content.content_body&limit=${limit}&offset=${offset}&termsAggregationField=content_id.keyword&order=desc`);
            setFetching(false);
        } else {
            result = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/search?user_id=${currentUser.id}&entity=interaction&excludeFields=response_body,content.content_body&limit=${limit}&offset=${offset}&termsAggregationField=content_id.keyword&valueInAnyField=${searchString}&order=desc`);
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

    const getCollection = async (contentId: string) => {
        let result: any = null;
        result = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/search?entity=interaction&user_id=${currentUser.id}&content_id=${contentId}`);
        return (result && result.data && result.data.results && result.data.results.length > 0) ? result.data.results[0] : {};
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
        getSearches();
    }, [pageNumber]);

    const handleReact = async (contentId: string, type: string) => {
        const body = {
            domain: 'CONTENT',
            event: type === 'like' ? 'LIKE' : 'UNLIKE',
            contentId: contentId
        }
        const fn: any = showLoader;
        fn();
        try {
            const result = await authAxios.post(`${process.env.REACT_APP_BASE_URL}/event`, body);
            alertContext.setSuccessAlert("The action was successfully completed");
            const fn: any = hideLoader;
            fn();
        } catch (error) {
            const { res } = error;
            alertContext.setErrorAlert(res.data.message);
            const fn: any = hideLoader;
            fn();
        }

    }


    const handleDetail = async (contentId: string) => {
        const fn: any = showLoader;
        fn();
        const detail = await getCollection(contentId);
        setCollectionDetail(detail);
    }

    const handleSearch = async (contentId: string) => {
        const search: any = await getCollection(contentId);
        const searchFilterCriteria = {
            content: search?.content?.content_body ? search?.content?.content_body : null,
            contentId: search?.content?.id,
            url: search?.content?.url ? search?.content?.url : search?.content?.content_link ? search?.content?.content_link : null
        }
        localStorage.setItem('collectionFilterCriteria', JSON.stringify(searchFilterCriteria));
        history.push('/');
    }

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
        setOffset(prev => prev + 20);
    };

    return (
        <div className="content m-15" style={{ minHeight: '550px' }}>
            {loader}
            {Object.entries(collectionDetail).length === 0 && <div className="bg-white py-5 newbox">
                <div className=" search-box margin0auto">
                    <div className="search-form">
                        <div className="input-group">
                            <input ref={searchRef} name="search" onKeyDown={handleKeyDown} value={searchString} className="form-control" placeholder="Search here..." type="text" onChange={(e) => { setSearcheString(e.target.value) }} />
                            <span className="input-group-btn">
                                <button name="search" id="search-btn" className="btn btn-flat" onClick={() => { getSearches(); Event('Collection', "Clicked on 'Search' ", "Clicked on 'Search' ") }}>
                                    <FontAwesomeIcon icon={faSearch} /> </button>
                            </span>
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
                                <img className="m-auto pt-2" width="50px" height="250px"
                                    src={getLogo(search) ? getLogo(search) : search?.content?.reference_image_link ? search?.content?.reference_image_link : search?.content?.url ? URL_PLACE_HOLDER : CONTENT_PLACE_HOLDER}
                                    alt="Card image cap" style={{ width: '100%', objectFit: 'contain' }} />
                                <div className="card-body align-items-center justify-content-center d-flex flex-column">
                                    <div style={{ height: '100px' }}>
                                        <h4 className="card-title">{search?.content?.name ? search?.content?.name.substr(0, 16) : getLogo(search) ? 'News Article' : 'Internet Content'}</h4>
                                        {search?.content?.content_body && <p className="contentText">{search?.content?.content_body}</p>}
                                    </div>
                                    <div>
                                        <a className="cursor-pointer" onClick={() => { { handleReact(search.content_id, 'like'); Event('Collection', "Clicked on 'Like Content' ", "Clicked on 'Like Content' for content: " + search.content_id) } }}>
                                            <FontAwesomeIcon className="text-blue font-24 mr-3" icon={faThumbsUp} data-toggle="tooltip" data-placement="bottom" title="Like and save to review later" />
                                        </a>
                                    </div>
                                    <div className="d-flex center pt-2 justify-content-center">
                                        <div className="mr-1">
                                            <button className="btn btn-primary mybtn" onClick={() => { handleDetail(search.content_id); Event('Collection', "Clicked on 'View Details' ", "Clicked on 'View Details' for content: " + search.content_id) }}>View Details</button>
                                        </div>
                                        <div className="ml-1">
                                            <button onClick={() => { handleSearch(search.content_id); Event('Collection', "Clicked on 'Run Search' ", "Clicked on 'Run Search' for content: " + search.content_id); }} className="btn btn-primary mybtn">Run Search</button>
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
                            <button onClick={() => { setPageNumber(+(pageNumber - 1)); Event('Collection', "Clicked on 'Page number' ", "Clicked on 'Page number'" + (pageNumber - 1)) }} aria-controls="example1" data-dt-idx="0" disabled={pageNumber === 0 ? true : false}>Previous</button>
                        </li>
                        {
                            pageCountArray.map((page, index) => {
                                return <li key={index} className={"paginate_button " + (pageNumber === index ? 'active' : '')}>
                                    <button onClick={() => { setPageNumber(index); Event('Collection', "Clicked on 'Page number' ", "Clicked on 'Page number'" + (index)) }} aria-controls="example1" data-dt-idx="1">{index + 1}</button>
                                </li>
                            })
                        }
                        <li className={"paginate_button next " + (pageNumber === pageCountArray.length - 1 ? 'disabled' : '')} id="example1_next">
                            <button onClick={() => { setPageNumber(+(pageNumber + 1)); Event('Collection', "Clicked on 'Page number' ", "Clicked on 'Page number'" + (pageNumber + 1)) }} aria-controls="example1" data-dt-idx="7" disabled={pageNumber === pageCountArray.length - 1 ? true : false}>Next</button>
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
            </div>}
            {Object.entries(collectionDetail).length !== 0 && <CollectionDetail backFromDetail={backFromDetail} hideLoader={() => { handleHideLoader() }} source={'collection'} collection={collectionDetail} runSearch={(contentId: string) => { handleSearch(contentId) }} typeCollection="collection" logo={getLogo(collectionDetail)} />}
        </div >
    );
};

export default Collection;