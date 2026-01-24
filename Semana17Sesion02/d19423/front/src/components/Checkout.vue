<template>
    <div class="checkout-page">
        <div class="checkout-card">
            <header class="checkout-header">
                <p class="eyebrow">Pago seguro</p>
                <h1>Finaliza tu compra</h1>
                <p class="subcopy">Tu pedido queda reservado por 10 minutos.</p>
            </header>

            <div class="checkout-grid">
                <section class="order-summary">
                    <div class="summary-head">
                        <h2>Orden</h2>
                        <span class="badge">#{{ order_id }}</span>
                    </div>
                    <ul class="summary-list">
                        <li>
                            <div>
                                <strong>{{ description }}</strong>
                                <small>Pack 18 layouts</small>
                            </div>
                            <span>S/ {{ amount }}</span>
                        </li>
                    </ul>
                    <div class="summary-divider"></div>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>S/ {{ amount }}</span>
                    </div>
                    
                    <div class="summary-total">
                        <span>Total</span>
                        <span>S/ {{ amount }}</span>
                    </div>
                </section>

                <form class="payment-form" @submit.prevent="payment" novalidate>
                    <div class="form-row">
                        <label for="email">Correo electronico</label>
                        <input
                            id="email"
                            v-model.trim="email"
                            type="email"
                            inputmode="email"
                            autocomplete="email"
                            placeholder="tucorreo@email.com"
                            :aria-invalid="Boolean(errors.email)"
                        >
                        <small v-if="errors.email" class="field-error">{{ errors.email }}</small>
                    </div>
                    <div class="form-row">
                        <label for="card">Numero de tarjeta</label>
                        <input
                            id="card"
                            v-model.trim="creditcard"
                            type="text"
                            inputmode="numeric"
                            autocomplete="cc-number"
                            placeholder="1234 5678 9012 3456"
                            :aria-invalid="Boolean(errors.creditcard)"
                        >
                        <small v-if="errors.creditcard" class="field-error">{{ errors.creditcard }}</small>
                    </div>
                    <div class="form-grid">
                        <div class="form-row exp-row">
                            <label for="month">Fecha de expiracion</label>
                            <div class="exp-fields">
                                <input
                                    id="month"
                                    v-model.trim="month"
                                    type="text"
                                    inputmode="numeric"
                                    autocomplete="cc-exp-month"
                                    placeholder="MM"
                                    maxlength="2"
                                    :aria-invalid="Boolean(errors.month)"
                                >
                                <span>/</span>
                                <input
                                    id="year"
                                    v-model.trim="year"
                                    type="text"
                                    inputmode="numeric"
                                    autocomplete="cc-exp-year"
                                    placeholder="AA"
                                    maxlength="4"
                                    :aria-invalid="Boolean(errors.year)"
                                >
                            </div>
                            <small v-if="errors.month || errors.year" class="field-error">
                                {{ errors.month || errors.year }}
                            </small>
                        </div>
                        <div class="form-row">
                            <label for="cvv">CVV</label>
                            <input
                                id="cvv"
                                v-model.trim="cvv"
                                type="password"
                                inputmode="numeric"
                                autocomplete="cc-csc"
                                placeholder="***"
                                :aria-invalid="Boolean(errors.cvv)"
                            >
                            <small v-if="errors.cvv" class="field-error">{{ errors.cvv }}</small>
                        </div>
                        <div class="form-row">
                            <label for="installments">Cuotas</label>
                            <input
                                id="installments"
                                v-model.number="installments"
                                type="number"
                                min="1"
                                max="12"
                                placeholder="3"
                                :aria-invalid="Boolean(errors.installments)"
                            >
                            <small v-if="errors.installments" class="field-error">{{ errors.installments }}</small>
                        </div>
                    </div>
                    <button  class="pay-button" :disabled="isSubmitting" @click="payment">
                        {{ isSubmitting ? "Procesando..." : "Pagar ahora" }}
                    </button>
                    <p class="helper">Encriptamos tu pago con nivel bancario.</p>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default{
        name: "Checkout",
        data(){
            return{
                order_id: 998877,
                description: "Curso de Programacion",
                amount: 250,
                installments: 2,
                telefono:'917830940',
                currency_code: 'PEN',
                email: 'rpineda@x-codec.net',

                creditcard:'4111111111111111',
                month: '09',
                year: '2027',
                cvv: '123',
                errors: {},
                isSubmitting: false
            }
        },
        methods:{
            validate(){
                const errors = {};
                const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
                const cardDigits = String(this.creditcard).replace(/\s+/g, "");
                const monthNum = Number(this.month);
                const yearNum = Number(this.year);
                const cvvDigits = String(this.cvv).trim();

                if (!emailOk) {
                    errors.email = "Correo no valido.";
                }
                if (cardDigits.length < 13 || cardDigits.length > 19) {
                    errors.creditcard = "Numero de tarjeta invalido.";
                }
                if (!Number.isInteger(monthNum) || monthNum < 1 || monthNum > 12) {
                    errors.month = "Mes invalido.";
                }
                if (!Number.isInteger(yearNum) || String(this.year).length < 2) {
                    errors.year = "Anio invalido.";
                }
                if (cvvDigits.length < 3 || cvvDigits.length > 4) {
                    errors.cvv = "CVV invalido.";
                }
                if (!Number.isInteger(this.installments) || this.installments < 1 || this.installments > 12) {
                    errors.installments = "Cuotas invalidas.";
                }

                this.errors = errors;
                return Object.keys(errors).length === 0;
            },
            async payment(){
                if (!this.validate()) {
                    return;
                }
                this.isSubmitting = true;
                axios({
                    method:'POST',
                    url:'http://localhost:8000/api/proccess/pay',
                    data:{
                        order_id: this.order_id,
                        description: this.description,
                        amount: this.amount,
                        installments: this.installments,
                        telefono:this.telefono,
                        currency_code: this.currency_code,
                        email: this.email,
                        creditcard:this.creditcard,
                        month: this.month,
                        year: this.year,
                        cvv: this.cvv
                    }
                }).then(respuesta=>{
                    console.log(respuesta);
                    alert(JSON.stringify(respuesta))
                }).catch(error=>{
                    console.log(error)
                }).finally(() => {
                    this.isSubmitting = false;
                })
            }
        }
    }
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Space+Grotesk:wght@400;500;600&display=swap");

:global(body) {
    margin: 0;
    background: radial-gradient(circle at top, #f7efe1 0%, #f5f0ff 40%, #f0f4ff 100%);
    font-family: "Space Grotesk", sans-serif;
    color: #1e1a2b;
}

:global(*) {
    box-sizing: border-box;
}

.checkout-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 32px 20px;
    position: relative;
    overflow: hidden;
}

.checkout-page::before,
.checkout-page::after {
    content: "";
    position: absolute;
    border-radius: 999px;
    filter: blur(0px);
    z-index: 0;
    opacity: 0.6;
}

.checkout-page::before {
    width: 340px;
    height: 340px;
    background: linear-gradient(120deg, #ffe3a3, #ff9ec4);
    top: -120px;
    left: -120px;
}

.checkout-page::after {
    width: 420px;
    height: 420px;
    background: linear-gradient(120deg, #a6d5ff, #b8f0e8);
    bottom: -180px;
    right: -160px;
}

.checkout-card {
    width: min(980px, 100%);
    background: rgba(255, 255, 255, 0.82);
    border-radius: 28px;
    padding: 32px;
    box-shadow: 0 30px 80px rgba(20, 16, 32, 0.15);
    position: relative;
    z-index: 1;
    backdrop-filter: blur(20px);
    animation: float-in 0.8s ease;
}

.checkout-header {
    text-align: left;
    margin-bottom: 28px;
}

.eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.26em;
    font-size: 0.72rem;
    color: #6d5b92;
    margin: 0 0 10px;
}

.checkout-header h1 {
    font-family: "Fraunces", serif;
    font-size: clamp(2rem, 3vw, 2.6rem);
    margin: 0 0 8px;
}

.subcopy {
    margin: 0;
    color: #5b5770;
    font-size: 1rem;
}

.checkout-grid {
    display: grid;
    gap: 28px;
    grid-template-columns: minmax(240px, 1fr) minmax(280px, 1.1fr);
}

.order-summary {
    background: linear-gradient(160deg, #fff6e1 0%, #fce3ec 100%);
    padding: 24px;
    border-radius: 20px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
    animation: rise-in 0.6s ease 0.05s both;
}

.summary-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.order-summary h2 {
    font-size: 1.2rem;
    margin: 0;
}

.badge {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    background: rgba(30, 26, 43, 0.1);
    color: #1e1a2b;
}

.summary-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 14px;
}

.summary-list li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
}

.summary-list strong {
    display: block;
    font-weight: 600;
}

.summary-list small {
    color: #6b5b7a;
}

.summary-divider {
    height: 1px;
    background: rgba(30, 26, 43, 0.15);
    margin: 18px 0;
}

.summary-row,
.summary-total {
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    margin-bottom: 10px;
}

.summary-total {
    font-weight: 600;
    font-size: 1.1rem;
}

.accent {
    color: #e1456d;
}

.payment-form {
    display: grid;
    gap: 18px;
    padding: 24px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: inset 0 0 0 1px rgba(30, 26, 43, 0.08);
    animation: rise-in 0.6s ease 0.15s both;
}

.form-row {
    display: grid;
    gap: 8px;
}

.form-row label {
    font-size: 0.85rem;
    color: #3c3450;
}

.form-row input {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(30, 26, 43, 0.15);
    font-size: 1rem;
    background: #fbfbff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-row input:focus {
    outline: none;
    border-color: #6d5b92;
    box-shadow: 0 0 0 3px rgba(109, 91, 146, 0.15);
}

.form-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.exp-row {
    gap: 10px;
}

.exp-fields {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto 1fr;
    gap: 8px;
}

.field-error {
    color: #c7375a;
    font-size: 0.78rem;
}

.pay-button {
    background: linear-gradient(120deg, #1f1a3a, #5f3dc4);
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 14px 16px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pay-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(63, 41, 124, 0.2);
}

.pay-button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
    box-shadow: none;
}

.helper {
    margin: 0;
    font-size: 0.8rem;
    color: #6b5b7a;
    text-align: center;
}

@keyframes float-in {
    from {
        opacity: 0;
        transform: translateY(18px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes rise-in {
    from {
        opacity: 0;
        transform: translateY(18px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 820px) {
    .checkout-card {
        padding: 24px;
    }

    .checkout-grid {
        grid-template-columns: 1fr;
    }
}
</style>
