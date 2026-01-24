import React ,{useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import { Button ,Card} from "react-bootstrap";



function StripePayment(){

    const [product] = useState({
        name: "Curso IOS 2026",
        price: 199.99,
        productOwner: "Roberto Pineda",
        description: "Curso de IOS Avanzado y Swift",
        quantity: 1
    })

    const hacerPago = async()=>{
        console.log("Hizo click");
        const body = {product};
        const headers = {"Content-Type": "application/json"};
        const response  = await fetch(
            "http://localhost:8000/api/create-checkout-session",
            {
                method:"POST",
                headers:headers,
                body: JSON.stringify(body)
            }
        );
        const session = await response.json();
        console.log(session)
        
        window.location.href = session.url
        
    }

    return(
      <Card style={{width: '40rem'}}>
        <Card.Img variant="top" src="https://picsum.photos/300/150" />
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Button variant="primary" onClick={hacerPago}>Compra este curso por S./ {product.price}</Button>
      </Card>
    )
}

export default StripePayment;