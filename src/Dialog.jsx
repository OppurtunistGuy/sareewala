import React,{useEffect,useRef,useId} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
export default function Dialog({title,onClose,children,drawer=false}){
 const ref=useRef(null);const id=useId();
 useEffect(()=>{const previous=document.activeElement;const scroll=document.body.style.overflow;document.body.style.overflow='hidden';const el=ref.current;const list=()=>[...el.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')].filter(x=>!x.disabled&&x.getClientRects().length);(list()[0]||el).focus();const key=e=>{if(e.key==='Escape'){e.preventDefault();onClose()}if(e.key==='Tab'){const items=list();const first=items[0],last=items.at(-1);if(!first){e.preventDefault();el.focus()}else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);document.body.style.overflow=scroll;if(previous?.isConnected)previous.focus()}},[onClose]);
 return createPortal(<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section ref={ref} className={'dialog '+(drawer?'drawer':'')} role="dialog" aria-modal="true" aria-labelledby={id} tabIndex={-1}><h2 id={id}>{title}</h2><button className="close icon" aria-label="Close dialog" onClick={onClose}><X/></button>{children}</section></div>,document.body);
}
