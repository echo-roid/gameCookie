import { useEffect } from "react";

export function GoogleAd(props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);



  return (
    <div className={`adsTags only-web ${props?.class || ''}`}>
    <ins
      className={`adsbygoogle `}
      style={`display:inline-block;width:${props.width}px;height:${props.height}px`}
      data-ad-client="ca-pub-2206181847362717"     // change this
      data-ad-slot={props.slot}                 // pass ad slot
    ></ins>
    </div>
  );
}

export function GoogleAdResponsive(props) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <div className={`adsTags only-resp ${props?.class || ''}`}>
      <ins class="adsbygoogle"
      style="display:inline-block;width:320px;height:100px"
      data-ad-client="ca-pub-2206181847362717"
      data-ad-slot={props.slot}
      // data-ad-format="auto"
      // data-full-width-responsive="true"
      >
      </ins>
    </div>
  );
}