import React, { useEffect, useState, useRef } from 'react';
import { useCountUp } from 'react-countup';

import ContentIcon from '../assets/images/counter/01.png';
import FilterIcon from '../assets/images/counter/02.png';
import CollectionIcon from '../assets/images/counter/03.png';
import UserIcon from '../assets/images/counter/04.png';
import AboutImage from '../assets/images/about/01.png';
import BackgroundImage from '../assets/images/pattern/07.png';
import Slider from "react-slick";
import Thumbnail1 from "../assets/images/thumbnail/01.png";
import Thumbnail2 from "../assets/images/thumbnail/02.png";
import Thumbnail3 from "../assets/images/thumbnail/03.png";
import './layout.scss';
import axios from 'axios';
import { AppStat } from '../context/types';
import useScrollHandler from '../hooks/ScrollHandler';


const StatAndWork = () => {

    const [contentsSearched, setContentsSearched] = useState(0);
    const [wordsFiltered, setWordsFiltered] = useState(0);
    const [wordsCollected, setWordsCollected] = useState(0);
    const [usersRegistered, setUsersRegistered] = useState(0);

    const windowScrollPostion = useScrollHandler();

    const ref = useRef<HTMLDivElement>(null);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const initialStat: AppStat = {
        totalContent: 0,
        totalContentSearch: 0,
        totalUser: 0,
        totalWordCollected: 0,
        totalWordFiltered: 0,
    }

    const [stat, setstat] = useState(initialStat);

    useEffect(() => {
        const fetchStat = async () => {
            const result = await axios(`${process.env.REACT_APP_BASE_URL}/filter/statistics`);
            setstat(result.data);
            setContentsSearched(result.data.totalContentSearch);
            setWordsFiltered(result.data.totalWordFiltered);
            setWordsCollected(result.data.totalWordCollected);
            setUsersRegistered(result.data.totalUser);
        }
        fetchStat();
    }, []);


    // useEffect(() => {
    //     if (null !== ref.current) {
    //         if (windowScrollPostion === ref.current.scrollTop) {
    //             // setTimeout(()=>{})
    //             con
    //         }
    //     }
    // }, [windowScrollPostion])


    return (
        <div ref={ref}>
            <section className="pt-4 pb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-6">
                            <div className="counter style-2">
                                <img className="img-center" src={ContentIcon} alt="" />
                                <span className="count-number">{contentsSearched}</span>
                                <h5>Texts Filtered</h5>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 xs-mt-5">
                            <div className="counter style-2">
                                <img className="img-center" src={FilterIcon} alt="" />
                                <span className="count-number">{wordsFiltered}</span>
                                <h5>Words Filtered</h5>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 sm-mt-5">
                            <div className="counter style-2">
                                <img className="img-center" src={CollectionIcon} alt="" />
                                <span className="count-number">{wordsCollected}</span>
                                <h5>Words Saved</h5>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 sm-mt-5">
                            <div className="counter style-2">
                                <img className="img-center" src={UserIcon} alt="" />
                                <span className="count-number">{usersRegistered}</span>
                                <h5>Users Registered</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pos-r py-10 bg-contain bg-pos-r text-left" id="howitworks">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-12 image-column bg-contain bg-pos-l" style={{ backgroundImage: `url(${BackgroundImage})`, backgroundRepeat: 'no-repeat' }}>
                            <img className="img-fluid" src={AboutImage} alt="" />
                        </div>
                        <div className="col-lg-6 col-md-12 ml-auto md-mt-5 pl-lg-5">
                            <div className="section-title">
                                <h2 className="title">How Does Beeblio Work?</h2>
                            </div>
                            <div className="work-process style-2">
                                <div className="work-process-inner"> <span className="step-num" data-bg-color="#ff7810">01</span>
                                    <h4>Enter The Text Or URL</h4>
                                    <p className="mb-0">You (the user) provide a text content or a public URL; you can also upload a file, to process a private content. </p>
                                </div>
                            </div>
                            <div className="work-process style-2 mt-5">
                                <div className="work-process-inner"> <span className="step-num" data-bg-color="#ff156a">02</span>
                                    <h4>Filter Out The Text</h4>
                                    <p className="mb-0">The application filters from the text all the most frequent words of the language (you decide how many of the most frequently used words should be filtered out).</p>
                                </div>
                            </div>
                            <div className="work-process style-2 mt-5">
                                <div className="work-process-inner"> <span className="step-num" data-bg-color="#ffb72f">03</span>
                                    <h4>Get The Results</h4>
                                    <p className="mb-0">The result is presented as a list of words with useful resources to learn more about them. You can open the dictionary definition, or you can learn, in the context of the text, how to read, spell, and say each word. Best of all: you can save the word and sentences containing it. That is how you can study and practice further at your convenience.
                                  </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="animatedBackground" data-bg-img="images/pattern/05.png">
                <div className="container">
                    <div className="row align-items-center text-left">
                        <div className="col-lg-5 col-md-12">
                            <div className="section-title mb-0">
                                <h6>A lifelong learning network </h6>
                                <h2 className="title">See what our <br />clients say</h2>
                                <p className="mb-0">Our massive body of questions ends with more than 217,000.
                                We then use learning science to model (and forget) how you
                                learn new words. Comparing your answers to the hundreds
                                of millions of responses from other Beeblio users, we
                                personalize your learning knowledge in order to be able to
                                provide you the best results.</p>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-12 md-mt-5">

                            <Slider {...settings}>
                                <div>
                                    <div className="item">
                                        <div className="testimonial">
                                            <div className="testimonial-img">
                                                <img className="img-center" src={Thumbnail1} alt="" />
                                            </div>
                                            <div className="testimonial-content">
                                                <p>I was skeptic at first, but Beeblio really works. It's incredible how accurate it is in showing me the words I don't know: from simpler texts to more advanced ones.</p>
                                                <div className="testimonial-caption">
                                                    <h5>Nicole Picoti</h5>
                                                    <label>Pilot user</label>
                                                </div>
                                            </div>
                                            <div className="testimonial-quote"><i className="flaticon-quotation"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div >
                                        <div className="testimonial">
                                            <div className="testimonial-img">
                                                <img className="img-center" src={Thumbnail2} alt="" />
                                            </div>
                                            <div className="testimonial-content">
                                                <p>The most surprising aspect of the app to me, is how I can decide the level of complexity, and the app will use that to provide only the words that I didn't know</p>
                                                <div className="testimonial-caption">
                                                    <h5>James Washburn</h5>
                                                    <label>Pilot user</label>
                                                </div>
                                            </div>
                                            <div className="testimonial-quote"><i className="flaticon-quotation"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div >
                                        <div className="testimonial">
                                            <div className="testimonial-img">
                                                <img className="img-center" src={Thumbnail3} alt="" />
                                            </div>
                                            <div className="testimonial-content">
                                                <p>With this software, I feel like I can study any text thrown at me: it proved incredibly useful for my school work. And it works for any subject: from English language to specialized text like marketing.</p>
                                                <div className="testimonial-caption">
                                                    <h5>Vanessa Leblanc</h5>
                                                    <label>Pilot user</label>
                                                </div>
                                            </div>
                                            <div className="testimonial-quote"><i className="flaticon-quotation"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Slider>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer white-bg pos-r o-hidden bg-contain">
                <div className="round-p-animation"></div>

                <div className="secondary-footer">
                    <div className="container">
                        <div className="copyright text-center">
                            <div className="col-md-12"> Copyright © Beeblio 2020 | All Rights Reserved</div>

                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default StatAndWork;