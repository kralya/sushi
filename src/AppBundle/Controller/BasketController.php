<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\Session;

class BasketController extends BaseController
{
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
        
//        return $this->render('default/index.html.twig', $params);
    }
    
    protected function setDeliveryPrice(Request $request)
    {
        // action = setDeliveryPrice
        // IN:
        // free: 30
        // price: 1.5
        // 
        // OUT: 
        // total: 13.82
        // delivery_price: "1.50"

        
       return ['total' => 0, 'delivery_price' => "0"];
    }
    
    protected function addToBasket(Request $request)
    {
        // action = addToBasket
        // IN:
        // item[category_id]: 16
        // item[other_data]: other_data
        // OUT:
        // BASKET (all item objects, total)
        return ['total' => 15];
    }
    
    protected function updateCount(Request $request)
    {
        // action = updateCount
        // IN:
        // count: 1
        // item_id: add_102
        // OUT:
        // [new total:] 2.26
        
        
    }
    
    protected function delete(Request $request)
    {
        
    }

    protected function getBasket(Request $request)
    {
        // return basket from session
    }
    
    protected function initCart()
    {
        $cart = new Session();
        
        if (!$cart->has('calling')){
            return;
        }
        
        $cart->set('calling', $cart->get('calling')+1);
    }
}
