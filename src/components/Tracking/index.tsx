import ReactGA from "react-ga";

const trackingId: any = process.env.REACT_APP_GA_TRACKING_ID;


export const initGA = () => {
	ReactGA.initialize(trackingId); 
}

export const PageView = () => {  
    ReactGA.pageview(window.location.pathname +  
                     window.location.search); 
}

export const InitAndPageViewGA = () => {
	ReactGA.initialize(trackingId);
	ReactGA.pageview(window.location.pathname +  
                     window.location.search); 
}

export const InitPageViewAndSetGA = (props: any) => {
  ReactGA.initialize(trackingId);
  ReactGA.pageview(window.location.pathname +  
                     window.location.search); 
  ReactGA.set(props);
}

export const Event = (category: any, action: any, label: any) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label
  });
};

export const SetDimension = (props: any) => {
  ReactGA.set(props);
};