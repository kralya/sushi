<?php

namespace AppBundle\Repo;

use Doctrine\ORM\EntityRepository;

class ProductRepo extends EntityRepository
{
    public function findPopular($min)
    {
        $q = $this->createQueryBuilder('p')
                ->select()
                ->where('p.recommended IS NOT NULL')
                ->andWhere('p.recommended > :minn')
                ->setParameter('minn', $min)
                ;
        
        return $q->getQuery()->execute();
    }
}