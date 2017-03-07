<?php

namespace AppBundle\Model;

use Symfony\Component\HttpFoundation\Session\Session;

class Cart
{
    private $cart;
    private $total = 0;

    public function __construct()
    {
        $this->cart = new Session();
        $this->cart->set('called', $this->cart->get('called')+1);
    }
    
    public function getTotal()
    {
        return $this->cart->get('basket')['total'];
    }


    public function isNew()
    {
        return 1 === $this->cart->get('called');
    }

    public function add($product, $countt)
    {
        $items = $this->cart->get('basket')['basket'];
        
        $item = $product->getForCart();
        $item['count']   = $countt + $this->getOldCount($product->getId());
        $item['half']    = null;
        $item['is_gift'] = 0;

        $items[$product->getId()] = $item;
        $this->cart->set('basket', ['basket' => $items]);
        
        $this->recalculateTotal();
        
        $this->cart->set('basket', [
            'basket' => $items, 
            'total' => $this->cart->get('total')
                ]);
    }
    
    public function updateCount($id, $countt)
    {
        $items = $this->cart->get('basket')['basket'];
        
        $items[$id]['count'] = $countt;
        
        $this->cart->set('basket', ['basket' => $items]);
        
        $this->recalculateTotal();
    }
    
    public function delete($id)
    {
        $items = $this->cart->get('basket')['basket'];
        unset($items[$id]);
        $this->cart->set('basket', ['basket' => $items]);
        
        $this->recalculateTotal();
    }
    
    public function loadAuxiliary($auxiliary)
    {
        $items = [];
        foreach ($auxiliary as $one) {
            $item            = $one->getAuxiliaryForCart();
            $item['count']   = 0;
            $item['half']    = null;
            $item['is_gift'] = 0;

            $items['add_' . $one->getId()] = $item;
        }
        
        $this->cart->set('basket', ['basket' => $items]);
    }
    
    public function get()
    {
        return $this->cart->get('basket');
    }
    
    protected function recalculateTotal()
    {
        $items = $this->cart->get('basket')['basket'];
        $total = 0;
        foreach($items as $item) {
            $total += $item['item_price'] * $item['count'];
        }
        
        $this->cart->set('total', $total);
        $basket = $this->cart->get('basket');
        $basket['total'] = $total;
        $this->cart->set('basket', $basket);
        $this->total = $total;
    }
    
    protected function getOldCount($id)
    {
        $items = $this->cart->get('basket')['basket'];
        
        return isset($items[$id]) ? $items[$id]['count'] : 0;
    }
    
    public function getOrder()
    {
        $currency = 'грн.';
        $br = '
';        

        $text = $this->getProducts();
        
        $dp = $this->getDeliveryPrice();
        $total = $this->cart->get('basket')['total'] + $dp;

        $text .= 'Доставка: '.  ($dp ? $dp.' ' .$currency : 'бесплатно').$br;
        $text .= 'Всего: '.$total.' '.$currency;
        
        return $text;
    }
    
    public function getProducts()
    {
        $currency = 'грн.';
        $items = $this->cart->get('basket')['basket'];
        
        if(!$items) {
            return '';
        }
        
        $text = '';
        $br = '
';        
        
        foreach($items as $item) {
            if (0 == $item['count']) {
                continue;
            }
            
            $text .= sprintf("%s, %s шт * %s $currency/шт = %s $currency %s", 
                    $item['item_name'], 
                    $item['count'], 
                    $item['item_price'], 
                    $item['count'] * $item['item_price'], 
                    $br);
        }
        
        return $text;
    }
    
    public function setDeliveryPrice($price)
    {
        $this->cart->set('delivery_price', $price);
    }
    
    public function getDeliveryPrice()
    {
        return $this->cart->get('delivery_price');
    }
}
