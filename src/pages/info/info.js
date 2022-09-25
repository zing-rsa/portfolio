import { useEffect } from 'react';
import './info.css'

function Info({ pos }) {

    useEffect(() => {

        var main = document.getElementById('main');
        var topbox = document.getElementById('grid-top');
        var sidebox = document.getElementById('grid-side');
        var mid1 = document.getElementById('grid-mid-1');
        var mid2 = document.getElementById('grid-mid-2');
        var mid3 = document.getElementById('grid-mid-3');
        var bottombox = document.getElementById('grid-bottom');

        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        var targetCentPos = pos * vh - (0.5 * vh);
        var currCentPos;
        var diff;

        main.addEventListener('scroll', () => {
            currCentPos = main.scrollTop + (vh * 0.5);
            diff = (targetCentPos - currCentPos) 

            topbox.style.transform =    'translateY(' + diff * (Math.abs(diff) * 0.0012 ) + 'px)';
            sidebox.style.transform =   'translateY(' + diff * (Math.abs(diff) * 0.003  ) + 'px)';
            mid1.style.transform =      'translateY(' + diff * (Math.abs(diff) * 0.004  ) + 'px)';
            mid2.style.transform =      'translateY(' + diff * (Math.abs(diff) * 0.002  ) + 'px)';
            mid3.style.transform =      'translateY(' + diff * (Math.abs(diff) * 0.0015 ) + 'px)';
            bottombox.style.transform = 'translateY(' + diff * (Math.abs(diff) * 0.001  ) + 'px)';

        });
    }, []);

    return (
        <div className='page info-page'>
            <div className='grid-container'>
                <div id='grid-top' className='grid-card grid-top'>
                    <div className='grid-box-header'>
                        <span>This is a test header</span>
                    </div>
                    <div className='grid-box-body'>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                </div>
                <div id='grid-mid-1' className='grid-card grid-box'>
                    <div className='grid-box-header'>
                        <span>This is a test header</span>
                    </div>
                    <div className='grid-box-body'>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                </div>
                <div id='grid-mid-2' className='grid-card grid-box'>
                    <div className='grid-box-header'>
                        <span>This is a test header</span>
                    </div>
                    <div className='grid-box-body'>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                </div>
                <div id='grid-mid-3' className='grid-card grid-box'>
                    <div className='grid-box-header'>
                        <span>This is a test header</span>
                    </div>
                    <div className='grid-box-body'>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                </div>
                <div id='grid-side' className='grid-card grid-side'>
                    <div className='grid-side-dark-diag'></div>
                    <div className='grid-box-duo-header'>
                        <span>This is a test header</span>
                    </div>
                    <div className='grid-box-body'>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                </div>
                <div id='grid-bottom' className='grid-card grid-bottom'>
                    <div className='grid-box-header'>
                        <span>This is a test header</span>
                    </div>
                    <div className='grid-box-body'>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Info;