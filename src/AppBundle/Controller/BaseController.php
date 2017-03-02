<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class BaseController extends Controller
{
    public function getRepo($repo)
    {
        return $this->container->get('doctrine')->getRepository('AppBundle:'.$repo);
    }
}
