import AnnouncementSlider from "./AnnouncementSlider";
import Banner from "./Banner";
import BannerGrid from "./BannerGrid";
import CustomerReviews from "./CustomerReviews";
import Footer from "./Footer";
import ProductCatalog from "./ProductCatalog";


const Home = () => {
    return (
        <div>
            <AnnouncementSlider></AnnouncementSlider>
            <Banner></Banner>;
            
            <ProductCatalog></ProductCatalog>
            <BannerGrid></BannerGrid>
            <CustomerReviews></CustomerReviews>
            <Footer></Footer>
        </div>
    );
};

export default Home;