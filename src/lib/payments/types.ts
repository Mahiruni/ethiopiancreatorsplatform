export type PaymentCurrency="ETB"|"USD";
export type PaymentStatus="pending"|"paid"|"failed"|"refunded"|"cancelled";
export interface CreatePaymentInput{txRef:string;amount:number;currency:PaymentCurrency;email?:string;firstName?:string;lastName?:string;phone?:string;callbackUrl:string;returnUrl:string;title:string;description?:string;metadata?:Record<string,string>}
export interface CreatePaymentResult{providerReference?:string;checkoutUrl:string;status:"pending"}
export interface VerifyPaymentResult{txRef:string;providerReference?:string;amount:number;currency:string;status:PaymentStatus;raw:unknown}
export interface WebhookVerificationResult{valid:boolean;txRef?:string;eventId?:string;raw?:unknown}
export interface PaymentProvider{name:string;createPayment(input:CreatePaymentInput):Promise<CreatePaymentResult>;verifyPayment(txRef:string):Promise<VerifyPaymentResult>;verifyWebhook(rawBody:string,headers:Headers):Promise<WebhookVerificationResult>;refundPayment(txRef:string,amount?:number):Promise<{status:PaymentStatus;raw:unknown}>}
export class PaymentProviderError extends Error{constructor(message:string,public code="PAYMENT_PROVIDER_ERROR"){super(message);this.name="PaymentProviderError"}}
