<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Model\Cart;

class BasketController extends BaseController
{
    protected $cart;
    public function __construct()
    {
        $this->cart = new Cart();
    }
    /**
     * @Route("/bdhandlers/basket.php", name="basket")
     */
    public function indexAction(Request $request)
    {
        $action = $request->request->get('action');
        
        $result = [];
        
        $this->initCart();
        
        if('setDeliveryPrice' === $action) {
            $result = $this->setDeliveryPrice($request);
        }
        
        if('addToBasket' === $action) {
            $result = $this->addToBasket($request);
        }
        
        if('getBasket' === $action) {
            $result = $this->getBasket($request);
        }
        
        if('updateCount' === $action) {
            $result = $this->updateCount($request);
        }
        
        if('delete' === $action) {
            $result = $this->delete($request);
        }
        
        return new JsonResponse($result);
    }
    
    /**
     * 
     * @Route("/bdhandlers/order.php", name="order")
     */
    public function orderAction(Request $request)
    {
        if($request->request->get('CB_NAME')) {
            $this->callMe($request);
            
            return new JsonResponse([]);
        }
        
        // no validation (?!)
        $indices = [
            'ADDRESS_DOM',
            'ADDRESS_ETAZ',
            'ADDRESS_KORPUS',
            'ADDRESS_KVARTIRA',
            'ADDRESS_PODEZD',
            'ADDRESS_ULICA',
            'CHANGE',
            'CITY',
            'COMMENT',
            'DELIVERY_NAME',
            'DELIVERY_PRICE',
            'DELIVERY_TIME',
            'DISTRICT',
            'NAME',
            'ORDER_EMAIL',
            'ORDER_STATUS_ID',
            'ORDER_VARIANT',
            'PAY_SYS',
            'PAY_SYS_TEXT',
            'PERSONS',
            'PHONE',
            'PROMOCODE',
            'RECEIVER_NAME',
            'RECEIVER_PHONE',
            'RESTAURANT_ADDRESS',
        ];
        
        $text = '';
        foreach ($indices as $index) {
            $value = $request->request->get($index);
            if(!$value) {
                continue;
            }
            $template = '%s: %s
';
            $text.= sprintf($template, $index, $value);
        }
        
        $br = '
';
        
        $order = (new Cart())->getOrder();
        
        $message = \Swift_Message::newInstance()
            ->setSubject('New order')
            ->setFrom('admin@eheh.com')
            ->setTo('hrumos@yahoo.com')
            ->setBody($text.$br.$order);

        $mailer = $this->get('mailer');

        $mailer->send($message);
        
//        $dt = $request->request->get('DELIVERY_TIME');
//        $dd = '25.02.2017 13:56:00';
//        $xx = new \DateTime($dd);
//        die('here');
//        $xx = $dt ? new \DateTime($dt) : new \DateTime();
//        
//        
//        $o = new \AppBundle\Entity\Order;
//        $o->setAddress($this->formAddress($request));
//
//        $o->setDeliveryTime($xx);
//        $o->setDeliveryType('1'); //FIXME CHANGE
//        $o->setPaymentType('1'); //FIXME CHANGE
//        $o->setStatus('1');
//
////        $o->setDeliveryType($request->request->get('DELIVERY_TYPE'));
//        $o->setFirstName($request->request->get('RECEIVER_NAME'));
//
//        $o->setNote($request->request->get('COMMENT'));
////        $o->setPaymentType($paymentType)
//        $o->setPhone($request->request->get('RECEIVER_PHONE'));
////        $o->setTotal($this->cart->getTotal());
//        $o->setTotal('100');
////        $o->setProducts($this->cart->getProducts());
//        $o->setProducts('smth');
//        
//        $em = $this->getDoctrine()->getEntityManager();
//        $em->persist($o);
//        $em->flush();

        // clean cart
        
        $this->cart->clean();
        
        return new JsonResponse('1');
    }
    
    protected function callMe(Request $request)
    {
        $template = "Hello!
                
                Please call %s: phone # is %s
                
Sincerely your site.";
        
        $name = $request->request->get('CB_NAME');
        $phone = $request->request->get('CB_PHONE');
        $text = sprintf($template, $name, $phone);
        
        $message = \Swift_Message::newInstance()
            ->setSubject('New request to call')
            ->setFrom('admin@eheh.com')
            ->setTo('hrumos@yahoo.com')
            ->setBody($text);

        $mailer = $this->get('mailer');

        $mailer->send($message);
    }

    protected function formAddress(Request $request)
    {
        $indices = [
            'CITY',
            'ADDRESS_ULICA',
            'ADDRESS_DOM',
            'ADDRESS_KORPUS',
            'ADDRESS_PODEZD',
            'ADDRESS_ETAZ',
            'ADDRESS_KVARTIRA',
        ];

        $text = '';
        foreach ($indices as $index) {
            $value = $request->request->get($index);
            if(!$value) {
                continue;
            }
            $template = '%s: %s
';
            $text.= sprintf($template, $index, $value);
        }
        
        return $text;
    }


    protected function setDeliveryPrice(Request $request)
    {
        $price = $request->request->get('price');
        $free = $request->request->get('free');
        $total = $this->cart->getTotal();
        
        if (0 === (int)$price) {
            return ['total' => $total, 'delivery_price' => 0];
        }
        
        $deliveryPrice = $total > $free ? 0 : $price;
        $this->cart->setDeliveryPrice($deliveryPrice);

       return ['total' => $total + $deliveryPrice, 'delivery_price' => $deliveryPrice];
    }
    
    protected function addToBasket(Request $request)
    {
        $id = $request->request->get('item')['item_id'];
        $countt = $request->request->get('item')['count'];
        $product = $this->getRepo('Product')->find($id);
        
        if (!$product) {
            return 'no product';
        }

        $this->cart->add($product, $countt);

        return [
            'total' => $this->cart->getTotal(),
            $this->cart->get(),
            ];
    }
    
    protected function updateCount(Request $request)
    {
        $countt = $request->request->get('count');
        $id = $request->request->get('item_id');
        $this->cart->updateCount($id, $countt);
        
        return $this->cart->getTotal();
    }
    
    protected function delete(Request $request)
    {
        $id = $request->request->get('item_id');
        $this->cart->delete($id);
        
        return $this->cart->getTotal();
    }

    protected function getBasket(Request $request)
    {
        return $this->cart->get();
    }
    
    protected function initCart()
    {
        if (!$this->cart->isNew()) {
            return;
        }

        $auxiliary = $this->getRepo('Product')->findByProposeInCart(true);
        $this->cart->loadAuxiliary($auxiliary);
    }
}
