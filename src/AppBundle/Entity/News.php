<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * News
 *
 * @ORM\Table(name="news")
 * @ORM\Entity(repositoryClass="AppBundle\Repo\NewsRepo")
 */
class News
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="header", type="string", length=256, nullable=false)
     */
    private $header;

    /**
     * @var string
     *
     * @ORM\Column(name="text", type="string", length=10000, nullable=false)
     */
    private $text;

    /**
     * @var string
     *
     * @ORM\Column(name="image", type="string", length=2564, nullable=false)
     */
    private $image;

    /**
     * @var datetime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=false)
     */
    private $createdAt;

    public function __construct()
    {
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $header
     *
     * @return News
     */
    public function setHeader($header)
    {
        $this->header = $header;

        return $this;
    }

    /**
     * @return string
     */
    public function getHeader()
    {
        return $this->header;
    }

    /**
     * @param string $text
     *
     * @return News
     */
    public function setText($text)
    {
        $this->text = $text;

        return $this;
    }

    /**
     * Get text
     *
     * @return string
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * @param string $image
     *
     * @return News
     */
    public function setImage($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @return string
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param datetime $createdAt
     *
     * @return News
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get parentId
     *
     * @return integer
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }
    
    public function getCreatedAtF()
    {
        return $this->createdAt->format('Y m d');
    }
}
