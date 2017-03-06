<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Product
 *
 * @ORM\Table(name="product")
 * @ORM\Entity(repositoryClass="AppBundle\Repo\ProductRepo")
 */
class Product
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
     * @ORM\Column(name="name", type="string", length=256, nullable=false)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="contains", type="string", length=1024, nullable=false)
     */
    private $contains;

    /**
     * @var integer
     *
     * @ORM\Column(name="price", type="integer", nullable=false)
     */
    private $price;

    /**
     * @var integer
     *
     * @ORM\Column(name="price_old", type="integer", nullable=false)
     */
    private $priceOld;

    /**
     * @var string
     *
     * @ORM\Column(name="weight", type="string", length=256, nullable=false)
     */
    private $weight;

    /**
     * @var string
     *
     * @ORM\Column(name="image", type="string", length=1024, nullable=false)
     */
    private $image;

    /**
     * @var integer
     *
     * @ORM\Column(name="sticker_top", type="smallint", nullable=false)
     */
    private $stickerTop;

    /**
     * @var integer
     *
     * @ORM\Column(name="sticker_bottom", type="smallint", nullable=false)
     */
    private $stickerBottom;

    /**
     * @var integer
     *
     * @ORM\Column(name="recommended", type="integer", nullable=false)
     */
    private $recommended;

    /**
     * @var Category $category
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Category", inversedBy="products")
     * @ORM\Column(name="category_id", type="integer", nullable=false)
     */
    private $category;
    
    /**
     * @var integer
     *
     * @ORM\Column(name="propose_in_cart", type="integer", nullable=true)
     */
    private $proposeInCart = null;

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
     * Set name
     *
     * @param string $name
     *
     * @return Product
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set contains
     *
     * @param string $contains
     *
     * @return Product
     */
    public function setContains($contains)
    {
        $this->contains = $contains;

        return $this;
    }

    /**
     * Get contains
     *
     * @return string
     */
    public function getContains()
    {
        return $this->contains;
    }

    /**
     * Set price
     *
     * @param integer $price
     *
     * @return Product
     */
    public function setPrice($price)
    {
        $this->price = $price;

        return $this;
    }

    /**
     * Get price
     *
     * @return integer
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * Set priceOld
     *
     * @param integer $priceOld
     *
     * @return Product
     */
    public function setPriceOld($priceOld)
    {
        $this->priceOld = $priceOld;

        return $this;
    }

    /**
     * Get priceOld
     *
     * @return integer
     */
    public function getPriceOld()
    {
        return $this->priceOld;
    }

    /**
     * Set weight
     *
     * @param string $weight
     *
     * @return Product
     */
    public function setWeight($weight)
    {
        $this->weight = $weight;

        return $this;
    }

    /**
     * Get weight
     *
     * @return string
     */
    public function getWeight()
    {
        return $this->weight;
    }

    /**
     * Set image
     *
     * @param string $image
     *
     * @return Product
     */
    public function setImage($image)
    {
        $this->image = $image;

        return $this;
    }

    /**
     * Get image
     *
     * @return string
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set stickerTop
     *
     * @param integer $stickerTop
     *
     * @return Product
     */
    public function setStickerTop($stickerTop)
    {
        $this->stickerTop = $stickerTop;

        return $this;
    }

    /**
     * Get stickerTop
     *
     * @return integer
     */
    public function getStickerTop()
    {
        return $this->stickerTop;
    }

    /**
     * Set stickerBottom
     *
     * @param integer $stickerBottom
     *
     * @return Product
     */
    public function setStickerBottom($stickerBottom)
    {
        $this->stickerBottom = $stickerBottom;

        return $this;
    }

    /**
     * Get stickerBottom
     *
     * @return integer
     */
    public function getStickerBottom()
    {
        return $this->stickerBottom;
    }

    /**
     * Set recommended
     *
     * @param integer $recommended
     *
     * @return Product
     */
    public function setRecommended($recommended)
    {
        $this->recommended = $recommended;

        return $this;
    }

    /**
     * Get recommended
     *
     * @return integer
     */
    public function getRecommended()
    {
        return $this->recommended;
    }

    /**
     * Set category
     *
     * @param Category $category
     *
     * @return Product
     */
    public function setCategory(Category $category)
    {
        $this->category = $category;

        return $this;
    }

    /**
     * Get category
     *
     * @return Category
     */
    public function getCategory()
    {
        return $this->category;
    }

    /**
     * Set proposeInCart
     *
     * @param integer $proposeInCart
     *
     * @return Product
     */
    public function setProposeInCart($proposeInCart)
    {
        $this->proposeInCart = $proposeInCart;

        return $this;
    }

    /**
     * Get proposeInCart
     *
     * @return integer
     */
    public function getProposeInCart()
    {
        return $this->proposeInCart;
    }
}
