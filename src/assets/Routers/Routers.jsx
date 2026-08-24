import { createBrowserRouter } from "react-router-dom";
import Home from "../Components/ui/Home";
import ProductCatalog from "../Components/ui/ProductCatalog";
import ProductDetails from "../Components/ui/ProductDetails";
import ShoppingCart from "../Components/ui/ShoppingCart";
import ErrorPage from "../Components/ui/ErrorPage";
import Root from "../Layout/Root";
import Login from "../Components/ui/Login";
import Register from "../Components/ui/Register";
import PrivateRoot from "../Components/ui/PrivateRoot";
import DashboardAll from "../pages/dashboard/DashboardAll";
import AddProducts from "../Components/ui/AddProducts";
import AllUser from "../Components/ui/AllUser";
import MyProfile from "../Components/ui/MyProfile";
import Checkout from "../Components/ui/Checkout";
import ManageOrders from "../Components/ui/ManageOrders";
import AdminProfile from "../Components/ui/AdminProfile";
import ManageProducts from "../Components/ui/ManageProducts";
import UpdateProduct from "../Components/ui/UpdateProduct";
import MyOrders from "../Components/ui/MyOrders";
import PaymentHistory from "../Components/ui/PaymentHistory";
import MakeAnnouncement from "../Components/ui/MakeAnnouncement";
import ReportedComments from "../Components/ui/ReportedComments";
import ContactUs from "../Components/ui/ContactUs";
import AdminMessages from "../Components/ui/AdminMessages";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root></Root>,
        errorElement:<ErrorPage></ErrorPage>,
        children: [
            {
                path:'/',
                element: <Home></Home>
            },{
                path:'/products',
                element: <PrivateRoot><ProductCatalog></ProductCatalog></PrivateRoot>
            },
            {
                path: '/checkOut',
                element: <Checkout></Checkout>
            },
            {
                path: '/products/:id',
                element: <PrivateRoot><ProductDetails></ProductDetails></PrivateRoot>,
                loader: ({params})=>fetch(`https://bilal-zone-backend.onrender.com/products/${params.id}`)
            },{
                path:'/cart',
                element:<PrivateRoot><ShoppingCart></ShoppingCart></PrivateRoot>
            },{
                path: '/login',
                element: <Login></Login>
            },{
                path: '/register',
                element: <Register></Register>
            },
            {
                path: '/contactUs',
                element: <PrivateRoot><ContactUs></ContactUs></PrivateRoot>
            },{
                path: '/dashboard',
                element: <PrivateRoot><DashboardAll></DashboardAll></PrivateRoot>,
                children : [
                    {
                        path: 'addProduct',
                        element: <AddProducts></AddProducts>
                    },{
                        path: 'allUser',
                        element: <AllUser></AllUser>
                    },{
                        path: 'myProfile',
                        element: <MyProfile></MyProfile>
                    },{
                        path:'manageOrders',
                        element: <ManageOrders></ManageOrders>
                    },{
                        path: 'adminProfile',
                        element: <AdminProfile></AdminProfile>
                    },{
                        path: 'manageProducts',
                        element: <ManageProducts></ManageProducts>
                    },
                    {
                       path: 'updateProduct/:id',
                      element: <UpdateProduct></UpdateProduct>
                     },{
                        path: 'myOrders',
                        element: <MyOrders></MyOrders>
                     },{
                        path: 'paymentHistory',
                        element: <PaymentHistory></PaymentHistory>
                     },{
                       path: 'makeAnnouncement',
                       element: <MakeAnnouncement></MakeAnnouncement>
                     },{
                        path: 'reportedComments',
                        element: <ReportedComments></ReportedComments>
                     },{
                        path: 'adminMessages',
                        element: <AdminMessages></AdminMessages>
                     }
                ]
            }
        ]
    }
]);


export default router;