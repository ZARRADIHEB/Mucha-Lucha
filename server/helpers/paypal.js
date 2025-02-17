import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: "sandbox",
  client_id:
    "AZFQcnjpWY6hiaulcvGsXgLqrBQfGxBZ3DSAkYzqVllKGvXrLUPIGpshKTrn-X7c1IafGG-Cek_HHSnv",
  client_secret:
    "EPNAWWFH4c2124WtHHbP5EvI0_6y0lCER9YyzRpM1TPz_yn8mMysSUM8ryNRc4H5wJAD4A0mhKD4YJSH",
});

export default paypal;
