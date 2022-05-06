import React, {PropsWithChildren, PropsWithoutRef} from 'react';
import { useClientEffect } from "../utils/hookts"

interface ITopBannerMessage {
  text: string
  from: number
}

interface ITopBannerProperties {
  history: Array<ITopBannerMessage>
}

const defaultProperties: ITopBannerProperties = {
   history: [],
 };

export interface ITopBannerContext extends ITopBannerProperties {
  addMessage: (m: ITopBannerMessage) => void 
  update: (key: keyof ISettingsProperties, value: any) => void
}

const defaultContext: ITopBannerContext = {
 ...defaultProperties,
  addMessage: () => {}, 
  update: () => {},
};

export const TopBannerContext = React.createContext<ITopBannerContext>(defaultContext);

export const TopBannerProvider = ({ children }):PropsWithChildren<{}> => {
  const [context, setContext] = React.useState<ITopBannerContext>(defaultContext);
  const ref = React.useRef<ITopBannerContext>(context);
  
  const updateContext = (ctx:ITopBannerContext) => {
     setContext({
       ...ctx,
     });
     ref.current = ctx;
   };

  const update = (key: keyof ITopBannerContext, value: any) => {
     const newContext = {
       ...ref.current,
       [key]: value,
     };
     updateContext(newContext);
     localStorage.setItem('top-banner-history', JSON.stringify(newContext));
  };

  const addMessage = (message: ITopBannerMessage) => {
    const updatedHistory = [
      ...ref.current.history,
      message
    ] 
    update('history', updatedHistory);
  }

   useClientEffect(() => {
     const fromStorage = localStorage.getItem('top-banner-history');
     const values = fromStorage ? JSON.parse(fromStorage) : defaultProperties;
     updateContext({
       ...defaultProperties,
       ...values,
       update,
       addMessage
     });
   }, []);
   return (
     <TopBannerContext.Provider value={context}>
       {children}
     </TopBannerContext.Provider>
   );
 };
