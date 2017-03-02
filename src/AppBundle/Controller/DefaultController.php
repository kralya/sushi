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
}
