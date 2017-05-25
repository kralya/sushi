<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class BaseController extends Controller
{
    public function getRepo($repo)
    {
        return $this->container->get('doctrine')->getRepository('AppBundle:'.$repo);
    }
    
    public function getParams()
    {
        $params = [];
        $params['receiver_email'] = 'hrumos@gmail.com';
        $params['min_summa'] = '300';
        $params['dostavka_time'] = 'c 10 утра до 9 вечера';
        $params['description'] = 'Доставка суши в Запорожье. Самый изысканный '
                . 'выбор. Всегда только свежие продукты и отменное качество '
                . 'блюд. Бесплатная доставка от '.$params['min_summa'].' гривен. '
                . 'Закажите прямо сейчас';
        $params['keywords'] = 'доставка суши в запорожье, суши на дом, '
                . 'бесплатная доставка, суши круглосуточно доставка, доставка '
                . 'еды, службы доставки еды, лучшие суши в Запорожье, заказ '
                . 'суши на дом, суши, нигири, маки, ура маки, роллы, лапша, '
                . 'сашими, салаты, закуски, рис, десерты, васаби';
        $params['title'] = 'Доставка суши в Запорожье. Два Пирата Ресторан.';
        $params['info_seller1'] = 'Два пирата';
        $params['info_seller2'] = 'Интернет-магазин www.dvapirata.zp.ua '
                . 'зарегистрирован в Пиратской республике';
        $params['phone'] = '(050)229-19-00';
        $params['mob_phone_1'] = '+380(50)229-19-00';
        $params['mob_phone_2'] = '+380(50)339-19-00';
        $params['phone_other'] = '+380(67)614-29-69';
        
        $params['fb'] = 'https://www.facebook.com/';
        $params['ig'] = 'https://instagram.com/';
        
        $params['adres1'] = 'пр-т Юбилейный, 20-а';
        $params['adres2'] = 'ул. Патриотическая, 68-а';
        $params['email_mark'] = 'marketing@dvapirata.zp.ua';
        $params['name'] = 'Два Пирата';
        
        $params['caffees'] = [
            ['id' => '31', 'en' => 'Moskovskaya273v', 'ru' => 'г. Брест, ул. Московская, 273В', ],
            ['id' => '33', 'en' => 'Dzerzhinskogo91', 'ru' => 'г. Минск, пр.Дзержинского 91', ]
            ];

        return $params;
    }
    
    public function render($template, array $parameters = [], Response $response = NULL)
    {
        $params = $this->getParams() + $parameters;
        
        return parent::render($template, $params, $response);
    }
}
