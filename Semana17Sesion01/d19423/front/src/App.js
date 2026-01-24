import React from "react";

import {BrowserRouter, Route, Routes} from 'react-router-dom'

import Cancel from "./components/Cancel";
import Success from "./components/Success";
import StripePayment from "./components/StripePayment";

function App(){

    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<StripePayment />} />
                <Route path="/cancel" element={<Cancel/>}/>
                <Route path="/success" element={<Success/>}/>
            </Routes>
        </BrowserRouter>
    )

}

export default App;