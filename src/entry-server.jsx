import React from 'react';
import {renderToString} from 'react-dom/server';
import App,{ErrorBoundary} from './main';
export function render(url){return renderToString(<ErrorBoundary><App initialUrl={url}/></ErrorBoundary>)}
