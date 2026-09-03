import AnnouncementSlider from "./AnnouncementSlider";
import Banner from "./Banner";
import BannerGrid from "./BannerGrid";
import CustomerReviews from "./CustomerReviews";
import FeaturedCategories from "./FeaturedCategories";
import Footer from "./Footer";
import ProductCatalog from "./ProductCatalog";


const Home = () => {
    return (
        <div>
            <AnnouncementSlider></AnnouncementSlider>
            <Banner></Banner>
            <FeaturedCategories></FeaturedCategories>
            
            <ProductCatalog></ProductCatalog>
            <BannerGrid></BannerGrid>
            <CustomerReviews></CustomerReviews>
            <Footer></Footer>
        </div>
    );
};

export default Home;