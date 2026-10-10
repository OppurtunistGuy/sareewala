import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import App,{ErrorBoundary} from './main';
const root=document.getElementById('root');
const element=<ErrorBoundary><App/></ErrorBoundary>;
if(root.hasChildNodes())hydrateRoot(root,element);else createRoot(root).render(element);
