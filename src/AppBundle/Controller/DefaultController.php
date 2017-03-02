<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function getRepo($repo)
    {
        return $this->container->get('doctrine')->getRepository('AppBundle:'.$repo);
    }
    
    /**
     * @Route("/hello", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $category = $this->getRepo('Category')->findOneByUrl('sushi');
        $products = $this->getRepo('Product')->findByCategory($category);
        
        $params = ['products' => $products];
        
        return $this->render('default/test.html.twig', $params);
    }
}
