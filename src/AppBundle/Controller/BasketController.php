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
    
    protected function setDeliveryPrice(Request $request)
    {
        $price = $request->request->get('price');
        $free = $request->request->get('free');
        
        if (0 === (int)$price) {
            return ['total' => 0, 'delivery_price' => 0];
        }
        
        $total = $this->cart->getTotal();
        $deliveryPrice = $total > $free ? 0 : $price;

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
