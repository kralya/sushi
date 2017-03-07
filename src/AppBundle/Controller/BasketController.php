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
            ->setSubject('test')
            ->setFrom('admin@eheh.com')
            ->setTo('hrumos@yahoo.com')
            ->setBody($text.$br.$order);
# I removed this line: $this->get('mailer')->send($message);

        $mailer = $this->get('mailer');

        $mailer->send($message);

        
//        mail('hrumos@gmail.com', 'new order', $text);
//        
        // email order AND cart details 
        // store order and cart in DB
        // clean cart
        
        return new JsonResponse('1');
    }
    
    protected function setDeliveryPrice(Request $request)
    {
        $price = $request->request->get('price');
        $free = $request->request->get('free');
        
        if (0 === (int)$price) {
            return ['total' => 0, 'delivery_price' => 0];
        }
        
        $total = $this->cart->getTotal();
        $deliveryPrice = $total > $free ? 0 : $price;
        $this->cart->setDeliveryPrice($deliveryPrice);

       return ['total' => $total, 'delivery_price' => $deliveryPrice];
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
