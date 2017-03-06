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
        
//        return $this->render('default/index.html.twig', $params);
    }
    
    protected function setDeliveryPrice(Request $request)
    {
        $price = $request->request->get('price');

        /*
        // action = setDeliveryPrice
        // IN:
        // free: 30
        // price: 1.5
        // 
        // OUT: 
        // total: 13.82
        // delivery_price: "1.50"
*/
        
       return ['total' => $price, 'delivery_price' => $price];
    }
    
    protected function addToBasket(Request $request)
    {
        /*
//        for items
//
//        item_id
//        count
//        category_id
//        category_name
//        item_name
//        item_img
//        item_price
//        item_old_price
//        is_gift
//        min_total
//        half_enabled
//        uniqueId
         * */
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
