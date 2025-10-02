
import { Link } from 'react-router'

const categories = [
  {
    name: '運動器材',
    subItems: ['重訓器材', '瑜珈用品', '健身車'],
  },
  {
    name: '運動配件',
    subItems: ['水壺', '毛巾', '護腕/護膝'],
  },
  {
    name: '服飾',
    subItems: ['上衣', '褲子', '外套'],
  },
  {
    name: '鞋款',
    subItems: ['跑鞋', '訓練鞋', '休閒鞋'],
  },
]

export default function Navbar() {
  return (
    <nav className="bg-gray-100 p-4 shadow">
      <ul className="flex space-x-8">
        {categories.map((category) => (
          <li key={category.name} className="group relative">
              <Link
                to={`/products/${encodeURIComponent(category.name)}`}
                className="cursor-pointer font-semibold hover:text-blue-600"
              >
                {category.name}
              </Link>

              {/* submenu 包在 absolute 容器裡 */}
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-white rounded p-2 shadow-lg z-50 whitespace-nowrap">
                {category.subItems.map((subItem) => (
                  <Link
                    key={subItem}
                    to={`/products/${encodeURIComponent(category.name)}/${encodeURIComponent(subItem)}`}
                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {subItem}
                  </Link>
                ))}
              </div>
            </li>

        ))}
      </ul>
    </nav>
  )
}

