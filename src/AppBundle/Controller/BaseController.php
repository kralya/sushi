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
    
    public function render($template, array $parameters = [], Response $response = NULL)
    {
        $params = [];
        $params['description'] = 'Доставка суши в Запорожье. Самый изысканный '
                . 'выбор. Всегда только свежие продукты и отменное качество '
                . 'блюд. Бесплатная доставка от 200 гривен. Закажите прямо '
                . 'сейчас';
        $params['keywords'] = 'доставка суши в запорожье, суши на дом, '
                . 'бесплатная доставка, суши круглосуточно доставка, доставка '
                . 'еды, службы доставки еды, лучшие суши в Запорожье, заказ '
                . 'суши на дом, суши, нигири, маки, ура маки, роллы, лапша, '
                . 'сашими, салаты, закуски, рис, десерты, васаби';
        $params['title'] = 'Доставка суши в Запорожье. Sushi House Ресторан '
                . 'Японской кухни (Суши Хаус)';
        $params['info_seller1'] = 'Два пирата';
        $params['info_seller2'] = 'Интернет-магазин www.dvapirata.zp.ua '
                . 'зарегистрирован в Пиратской республике';
        $params['phone'] = '(099)668-11-11';
        $params['mob_phone_1'] = '+380(99)668-11-11';
        $params['mob_phone_2'] = '+380(50)668-11-11';
        
        $params['fb'] = 'https://www.facebook.com/sushihouseby';
        $params['ig'] = 'https://instagram.com/sushihouseby';
        
        $params['caffees'] = [
            ['id' => '31', 'en' => 'Moskovskaya273v', 'ru' => 'г. Брест, ул. Московская, 273В', ],
            ['id' => '33', 'en' => 'Dzerzhinskogo91', 'ru' => 'г. Минск, пр.Дзержинского 91', ]
            ];
        
        $params += $parameters;
        
        return parent::render($template, $params, $response);
    }
}
