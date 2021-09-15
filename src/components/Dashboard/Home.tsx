import React, { useEffect, useState, useContext } from "react";
import az from "../../assets/images/dashboard/az.png";
import FilterIcon from "../../assets/images/dashboard/02.png";
import URLIcon from "../../assets/images/dashboard/01.png";
import WordIcon from "../../assets/images/dashboard/03.png";
import { Bar } from "react-chartjs-2";
import { authAxios } from "../../api/authApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/auth/AuthContextProvider";
import Spinner from "../../assets/images/spinner.svg";
import { Link, useRouteMatch, useLocation, useHistory } from "react-router-dom";

const initialStat = {
  totalContentSearched: 0,
  totalUrlSearched: 0,
  totalContentCollected: 0,
  totalSentencesCollected: 0,
  totalWordCollected: 0,
};

const Home = () => {
  const [data, setData] = useState({});
  const [stat, setStat] = useState(initialStat);
  const currentUser: any = localStorage.getItem("currentUser");
  const user = JSON.parse(currentUser);
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const chartWidth = width > 767 ? 500 : 300;
  const chartHeight = width > 767 ? 240 : 200;
  const authContext = useContext(AuthContext);
  const profileUpdated = authContext.profileUpdated;

  const getStat = async () => {
    const reuslt = await authAxios.get(
      `${process.env.REACT_APP_BASE_URL}/user/statistics`
    );
    setStat(reuslt.data);
    const chartData = await authAxios.get(
      `${process.env.REACT_APP_BASE_URL}/user/word-chart`
    );
    if (chartData) {
      setData(formatChartData(chartData));
    }
  };

  useEffect(() => {
    localStorage.removeItem("collectionFilterCriteria");
    localStorage.removeItem("searchedFilterCriteria");
    getStat();
  }, []);

  useEffect(() => {
    if (authContext.profileUpdated) {
      getStat();
    }
  }, [authContext]);

  const formatChartData = (chartData: any) => {
    const labels: string[] = [];
    const wordSearched: number[] = [];
    const wordCollected: number[] = [];

    chartData.data.map((resultData: any) => {
      labels.push(
        resultData.monthValue === 1
          ? "Jan"
          : resultData.monthValue === 2
          ? "Feb"
          : resultData.monthValue === 3
          ? "Mar"
          : resultData.monthValue === 4
          ? "Apr"
          : resultData.monthValue === 5
          ? "May"
          : resultData.monthValue === 6
          ? "Jun"
          : resultData.monthValue === 7
          ? "Jul"
          : resultData.monthValue === 8
          ? "Aug"
          : resultData.monthValue === 9
          ? "Sep"
          : resultData.monthValue === 10
          ? "Oct"
          : resultData.monthValue === 11
          ? "Nov"
          : "Dec"
      );
      wordSearched.push(+resultData.wordFiltered);
      wordCollected.push(+resultData.wordCollected);
    });
    const resultData = {
      labels: labels,
      datasets: [
        {
          label: "Words Searched",
          backgroundColor: "#5867DD",
          data: wordSearched,
        },
        {
          label: "Words Saved",
          backgroundColor: "#008CD3",
          data: wordCollected,
        },
      ],
    };
    return resultData;
  };

  return (
    <div className="content">
      <div className="d-flex flex-column flex-sm-row">
        {/* style={{ maxHeight: '240px' }} */}
        <div className="flex-1 mr-0 mr-sm-2">
          <div className="container info-box bluegrad">
            <div className="d-flex flex-column flex-sm-row m-b-2">
              <div className="flex-1 pt-4 ">
                <h4>Welcome back {user?.apiUserProfile?.firstName}</h4>
                <p>
                  With Beeblio, you will learn individually the words you want
                  to know in order to read better, write more easily and think
                  sharp. The Dashboard offers you helpful insights to help you
                  see your progress.
                </p>
              </div>
              <div className="flex-1">
                <img src={az} className="wow fadeInUp" alt="az" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 mt-2 mt-sm-0">
          <div className="info-box bg-white">
            <div className="col-12">
              <div className="d-flex flex-wrap">
                <div>
                  <h5>Words Saved</h5>
                  {Object.entries(data).length === 0 && (
                    <div
                      style={{ width: "100%" }}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <img className="mx-auto text-center" src={Spinner} />
                    </div>
                  )}
                  <div className="d-flex">
                    {Object.entries(data).length > 0 && (
                      <Bar
                        data={data}
                        width={chartWidth}
                        height={chartHeight}
                      />
                    )}
                    {/* width={500} height={240} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-lg-4">
          <div className="small-box bg-white">
            <div className="inner">
              <Link to={`/dashboard/search`}>
                <div className="row m-b-2">
                  <div className="col-md-auto">
                    <span className="info-box-text">Contents Filtered</span>
                    <img src={FilterIcon} alt="filter" />
                  </div>
                  <div className="col pt-5">
                    <h1 className="text-right text-blue text-bold">
                      <sup>
                        <FontAwesomeIcon icon={faArrowUp} />
                      </sup>
                      {stat?.totalContentSearched}
                    </h1>
                  </div>
                </div>

                <div className="m-b-2"></div>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="small-box bg-white">
            <div className="inner">
              <Link to={`/dashboard/search`}>
                <div className="row m-b-2">
                  <div className="col-md-auto">
                    <span className="info-box-text">Words Saved</span>
                    <img src={URLIcon} alt="url" />
                  </div>
                  <div className="col pt-5">
                    <h1 className="text-right text-blue text-bold">
                      <sup>
                        <FontAwesomeIcon icon={faArrowUp} />
                      </sup>
                      {stat?.totalWordCollected}
                    </h1>
                  </div>
                </div>

                <div className="m-b-2">
                  {/* <div className="progress bg-lightblue">
                                    style="width: 45%; height: 6px;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"
                                    <div className="progress-bar bg-green" role="progressbar" ></div>
                                </div> */}
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="small-box bg-white">
            <div className="inner">
              <Link to={`/dashboard/settings`}>
                <div className="row m-b-2">
                  <div className="col-md-auto">
                    <span className="info-box-text">Sentences Saved</span>
                    <img src={WordIcon} alt="wordIcon" />
                  </div>
                  <div className="col pt-5">
                    <h1 className="text-right text-blue text-bold">
                      <sup>
                        <FontAwesomeIcon icon={faArrowUp} />
                      </sup>
                      {stat?.totalSentencesCollected}
                    </h1>
                  </div>
                </div>
              </Link>
              <div className="m-b-2">
                {/* <div className="progress bg-lightblue">
                                    style="width: 75%; height: 6px;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"
                                    <div className="progress-bar bg-purple" role="progressbar" ></div>
                                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
