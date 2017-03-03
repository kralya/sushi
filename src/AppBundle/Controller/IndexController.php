<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

class IndexController extends BaseController
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
        
        return $this->render('default/index.html.twig', $params);
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
     * @Route("/news", name="news")
     */
    public function newsAction(Request $request)
    {
        
        $repo = $this->getRepo('News');
        $params['news'] = $repo->findAll();
        
        return $this->render('default/news.html.twig', $params);
    }
    
    /**
     * @Route("/delivery", name="delivery")
     */
    public function deliveryAction(Request $request)
    {
        return $this->render('default/delivery.html.twig', []);
    }
}
