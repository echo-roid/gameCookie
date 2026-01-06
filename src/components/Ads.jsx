
// 160x600
export function Ads1() {
    return (
        <>
        <div className="side-ad">
            <i className="fas fa-ad"></i>
            <p>Advertisement Space</p>
            {/* 160x600 */}
        </div>
        </>
	);
}

//1473x150
export function Ads2(props) {
    return (
        <>
        <div className={`container ad mt-2 mb-2 ${props?.class || ''}`}>
            <div className="ad-section">
                <i className="fas fa-rectangle-ad"></i>
                <p>Advertisement Space</p>
                 {/* - 1376x100< */}
            </div>
        </div>
        </>
	);
}

//475x600
export function Ads3() {
    return (
        <>
        <div className="ad-section details-sidebar-ads" style={{ height: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <i className="fas fa-ad"></i>
            <p>Advertisement Space</p>
            {/* <br />475x600 */}
        </div>
        </>
	);
}

//974x150
export function Ads4(props) {
    return (
        <>
        <div className={`container ad mt-2 mb-2 ${props?.class || ''}`}>
            <div className="ad-section">
                <i className="fas fa-rectangle-ad"></i>
                <p>Advertisement Space</p>
                 {/* - 974x150 */}
            </div>
        </div>
        </>
	);
}





// export const Ads1 = () => {
//     useEffect(() => {
//         // Load AdSense script asynchronously
//         const loadAds = () => {
//             try {
//                 (window.adsbygoogle = window.adsbygoogle || []).push({});
//             } catch (e) {
//                 console.error('AdSense error:', e);
//             }
//         };
        
//         // Delay AdSense initialization
//         setTimeout(loadAds, 500);
//     }, []);
    
//     return (
//         <div className="ad-container">
//             <ins className="adsbygoogle"
//                  style={{ display: 'block' }}
//                  data-ad-client="your-client-id"
//                  data-ad-slot="your-slot-id"
//                  data-ad-format="auto"
//                  data-full-width-responsive="true">
//             </ins>
//         </div>
//     );
// };