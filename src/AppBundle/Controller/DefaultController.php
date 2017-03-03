<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends BaseController
{
    /**
     * @Route("/", name="homepage")
     * @Route("/hello")
     */
    public function indexAction(Request $request)
    {
        $category = $this->getRepo('Category')->findOneByUrl('sushi');
        $products = $this->getRepo('Product')->findByCategory($category);
        
        $params = ['products' => $products];
        
        return $this->render('default/test.html.twig', $params);
    }

    /**
     * @Route("/menu", name="menu")
     * @Route("/menu/{category}")
     */
    public function menuAction(Request $request)
    {
        $url = $request->get('category');
        $category = $this->getRepo('Category')->findOneByUrl($url);
        
        if( $url && !$category) {
            throw $this->createNotFoundException('The product does not exist');
        }
        
        $repo = $this->getRepo('Product');
        $products = $url ? $repo->findByCategory($category) : $repo->findAll();
        $params = ['products' => $products];
        
        return $this->render('default/test.html.twig', $params);
    }
    
    /**
     * @Route("/sample", name="sample")
     */
    public function sampleAction(Request $request)
    {
        
        $params = [];
        $params['description'] = 'Доставка суши в Запорожье. Самый изысканный выбор. Всегда только свежие продукты и отменное качество блюд. Бесплатная доставка от 250 000 рублей. Закажите прямо сейчас';
        $params['keywords'] = 'доставка суши в запорожье, суши на дом, бесплатная доставка, суши круглосуточно доставка, доставка еды, службы доставки еды, лучшие суши в минске, заказ суши на дом, суши, нигири, маки, ура маки, роллы, лапша, сашими, салаты, закуски, рис, десерты, васаби';
        $params['title'] = 'Доставка суши в Минске. Sushi House Ресторан Японской кухни (Суши Хаус)';
        $params['info_seller1'] = 'OOO "Глобалпрогрупп" г.Минск, ул. Казинца, 123, оф.6 УНП 192610415';
        $params['info_seller2'] = 'Интернет-магазин www.sushihouse.by зарегистрирован в Торговом реестре Республики Беларусь №331264 от 18.05.2016';
        $params['phone'] = '668-11-12';
        
        $params['vk'] = 'https://vk.com/sushihouseby';
        $params['fb'] = 'https://www.facebook.com/sushihouseby';
        $params['ig'] = 'https://instagram.com/sushihouseby';
        $params['ok'] = 'http://ok.ru/group/51994461470904';
        
        $caffees = [
            ['id' => '31', 'en' => 'Moskovskaya273v', 'ru' => 'г. Брест, ул. Московская, 273В', ],
            ['id' => '33', 'en' => 'Dzerzhinskogo91', 'ru' => 'г. Минск, пр.Дзержинского 91', ]
            ];
        
        return $this->render('default/my.html.twig', $params);
    }
}
