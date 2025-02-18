import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: "sandbox",
  client_id:
    "ATSVLp5eC3WI2f_fGG80weMEzSzFEVGPMWpCChUEz8RZOpbLEGn6qa1JiHhzFee42tGpKJhpt3FFtW0X",
  client_secret:
    "EEw3uzA1t4zGQZUkyXYDIf6TBqH0PsGkQtKavAiK9Bn0AZeDq0J4rY0DJ1gYIT7oJQyFE23izPSDZVHk",
});

export default paypal;
