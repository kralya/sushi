<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class IndexController extends BaseController
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $products = $this->getRepo('Product')->findPopular(1);
        $categories = $this->getRepo('Category')->findAll();
        $params = ['products' => $products, 'categories' => $categories];
        
        return $this->render('default/index.html.twig', $params);
    }

    /**
     * @Route("/menu", name="menu")
     * @Route("/menu/", name="menu")
     * @Route("/menu/{category}")
     */
    public function menuAction(Request $request)
    {
        $url        = $request->get('category');
        $category   = $this->getRepo('Category')->findOneByUrl($url);
        $repo       = $this->getRepo('Product');
        $categories = $this->getRepo('Category')->findAll();

        if ($url && !$category && 'popular' !== $url) {
            throw $this->createNotFoundException('The category ' . $url . ' does not exist');
        }

        if ($url === 'popular') {
            $products = $repo->findByPopular(true);
        } elseif ($url) {
            $products = findByCategory($category);
        } else {
            $products = $repo->findAll();
        }

        $params = ['products' => $products, 'categories' => $categories];

        return $this->render('default/menu.html.twig', $params);
    }

    /**
     * @Route("/news", name="news")
     */
    public function newsAction(Request $request)
    {
        $repo = $this->getRepo('Product');
        $products = $repo->findAll();
        $categories = $this->getRepo('Category')->findAll();

        $repo = $this->getRepo('News');
        $params = ['products' => $products, 'categories' => $categories, 'news' => $repo->findAll()];
        
        return $this->render('default/news.html.twig', $params);
    }
    
    /**
     * @Route("/delivery", name="delivery")
     */
    public function deliveryAction(Request $request)
    {
        $repo = $this->getRepo('Product');
        $products = $repo->findAll();
        $categories = $this->getRepo('Category')->findAll();
        $params = ['products' => $products, 'categories' => $categories];
        
        return $this->render('default/delivery.html.twig', $params);
    }
    
    /**
     * @Route("/bdhandlers/likes_bd.php", name="likes")
     */
    public function likeAction(Request $request)
    {
        $id = $request->request->get('item_id');
        
        $product = $this->getRepo('Product')->find($id);
        if(!$id || !$product){
            return '';
        }
        
        $sess = new \Symfony\Component\HttpFoundation\Session\Session();
        $likes = $sess->get('likes');
        if(in_array($id, $likes)) {
            unset($likes[$id]);
            $product->setDisliked();
        } else {
            $likes[$id] = true;
            $product->setLiked();
        }
        
        $sess->set('likes', $likes);
        
        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($product);
        $em->flush();
        
        $params = ['total' => $product->getRecommended(), 'user_like' => (int)$likes[$id]];
        
        return new JsonResponse($params);
    }
}
