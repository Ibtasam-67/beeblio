import ReactPixel from 'react-facebook-pixel';


const fbpId: any = process.env.REACT_APP_FBP;

//const advancedMatching = { em: 'some@email.com' }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching

const options = {
  autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
  debug: false, // enable logs
};


export const initFBP = () => {
  ReactPixel.init(fbpId, undefined, options);
}

export const FbPageView = () => {  
  ReactPixel.pageView();
}

export const TrackFbpStandardEvent = (event: string, data: any) => {
  ReactPixel.track(event, data); 
}

export const TrackFbpCustomEvent = (event: string, data: any) => {
  ReactPixel.trackCustom(event, data); 
}