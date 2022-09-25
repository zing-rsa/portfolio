import { useEffect } from 'react';
import './info.css'

function Info({ pos }) {

    // useEffect(() => {
    //     var topbox = document.getElementById('grid-top');
    //     var sidebox = document.getElementById('grid-side');
    //     var main = document.getElementById('main');

    //     const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

    //     // topbox.style.transform = `translateY(${2 * vh}px)`;

    //     main.addEventListener('scroll', () => {
    //         var translate = vh - main.scrollTop;

    //         if (translate > -100 && translate < 100){
    //             topbox.style.transform =  'translateY(' + translate * 0.9 + 'px)';
    //             sidebox.style.transform =  'translateY(' + translate * 0.9 + 'px)';
    //         } else {
    //             topbox.style.transform =  'translateY(' + translate + 'px)';
    //             sidebox.style.transform =  'translateY(' + translate + 'px)';
    //         }
    //     })
    // }, []);


    useEffect(() => {
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        // var topDist = 
        var centPos = pos * vh - (0.5*vh)

    }, []);

    return (
        <div className='page info-page'>
            <div className='grid-container'>
                {/* <div id='grid-top' className='grid-card grid-top'>
                    <div className='grid-box-header'>
                        <span>This is a test header</span>
                    </div>
                    <div className='grid-box-body'>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                </div>
                <div className='grid-card grid-box'>
                    <div className='grid-box-header'>
                        <span>This is a test header</span>
                    </div>
                    <div className='grid-box-body'>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                </div>
                <div className='grid-card grid-box'>
                    <div className='grid-box-header'>
                        <span>This is a test header</span>
                    </div>
                    <div className='grid-box-body'>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                </div>
                <div className='grid-card grid-box'>
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
                <div className='grid-card grid-bottom'>
                    <div className='grid-box-header'>
                        <span>This is a test header</span>
                    </div>
                    <div className='grid-box-body'>
                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                    </div>
                </div> */}
            </div>
        </div>

    )
}

export default Info;