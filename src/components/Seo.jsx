import {Helmet} from "react-helmet";

const Seo = ({
        title,
        description,
        keywords,
        image = '',
        canonical = '',
        ogType = "website"
    }) => {

    const defaultImage = import.meta.env.VITE_BASE_URL + '/images/logo.png';
    const siteName = "GamesCookie";
    const siteUrl = import.meta.env.VITE_BASE_URL;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Canonical */}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={canonical || siteUrl} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image || defaultImage} />

            <meta name="mobile-web-app-capable" content="yes" />
        </Helmet>
	);
}

export default Seo;