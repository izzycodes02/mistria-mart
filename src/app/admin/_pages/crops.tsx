'use client';

import { Column, DataTable, DataTableRef, StatBlock } from '@/components/ui/common/Datatable';
import {
  IconCheck,
  IconPlus,
  IconX,
  IconUser,
  IconCalendar,
  IconSearch
} from '@tabler/icons-react'
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import '@/styles/admin.scss';
import {
  DataTableFilters,
  FilterConfig,
} from '@/components/ui/common/DatatableFilters';

interface Crop {
  id: string;
  name: string;
  image: string | null;
  season: string[]; // jsonb array
  source: string | null;
  growthTime: number | null;
  regrowthTime: number | null;
  seedPrice: number | null;
  sellPrice: number | null;
  donateable: boolean | null;
  museumSet: string | null;
  forageLocation: string[] | null; // jsonb array
  type: string[] | null; // jsonb array
}

export default function CropsPage() {
  const tableRef = useRef<DataTableRef<Crop>>(null);

  // Sample data matching database schema
  const cropsData: Crop[] = [
    {
      id: 'turnip',
      name: 'Turnip',
      image: 'https://fieldsofmistria.wiki.gg/images/b/b7/Turnip.png?e82d93',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 4,
      regrowthTime: 0,
      seedPrice: 25,
      sellPrice: 40,
      donateable: true,
      museumSet: 'Spring Crop',
      forageLocation: null,
      type: ['single'],
    },
    {
      id: 'potato',
      name: 'Potato',
      image: 'https://fieldsofmistria.wiki.gg/images/c/c2/Potato.png?e58bd2',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 6,
      regrowthTime: 0,
      seedPrice: 40,
      sellPrice: 75,
      donateable: true,
      museumSet: 'Spring Crop',
      forageLocation: null,
      type: ['single'],
    },
    {
      id: 'carrot',
      name: 'Carrot',
      image: 'https://fieldsofmistria.wiki.gg/images/c/c3/Carrot.png?63a338',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 6,
      regrowthTime: 0,
      seedPrice: 40,
      sellPrice: 80,
      donateable: false,
      museumSet: 'None',
      forageLocation: null,
      type: ['single'],
    },
    {
      id: 'cabbage',
      name: 'Cabbage',
      image: 'https://fieldsofmistria.wiki.gg/images/Cabbage.png?e2dbdf',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 9,
      regrowthTime: 0,
      seedPrice: 70,
      sellPrice: 180,
      donateable: true,
      museumSet: 'Spring Crop',
      forageLocation: null,
      type: ['single'],
    },
    {
      id: 'tulip',
      name: 'Tulip',
      image: 'https://fieldsofmistria.wiki.gg/images/c/cf/Tulip.png?134974',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 6,
      regrowthTime: 0,
      seedPrice: 20,
      sellPrice: 30,
      donateable: true,
      museumSet: 'Spring Flower',
      forageLocation: null,
      type: ['single'],
    },
    {
      id: 'strawberry',
      name: 'Strawberry',
      image:
        'https://fieldsofmistria.wiki.gg/images/6/6d/Strawberry.png?936558',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 5,
      regrowthTime: 3,
      seedPrice: 300,
      sellPrice: 125,
      donateable: true,
      museumSet: 'Spring Crop',
      forageLocation: null,
      type: ['multi'],
    },
    {
      id: 'peas',
      name: 'Peas',
      image: 'https://fieldsofmistria.wiki.gg/images/e/e8/Peas.png?ae8607',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 5,
      regrowthTime: 3,
      seedPrice: 300,
      sellPrice: 135,
      donateable: false,
      museumSet: 'None',
      forageLocation: null,
      type: ['multi'],
    },
    {
      id: 'lilac',
      name: 'Lilac',
      image: 'https://fieldsofmistria.wiki.gg/images/5/5f/Lilac.png?ec8693',
      season: ['Spring'],
      source: 'Foraging',
      growthTime: 9,
      regrowthTime: 3,
      seedPrice: 0,
      sellPrice: 35,
      donateable: true,
      museumSet: 'Spring Flower',
      forageLocation: null,
      type: ['multi', 'foragable'],
    },
    {
      id: 'cherry',
      name: 'Cherry',
      image: 'https://fieldsofmistria.wiki.gg/images/2/20/Cherry.png?d6e773',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 14,
      regrowthTime: 3,
      seedPrice: 400,
      sellPrice: 45,
      donateable: true,
      museumSet: 'Spring Crop',
      forageLocation: null,
      type: ['tree'],
    },
    {
      id: 'lemon',
      name: 'Lemon',
      image: 'https://fieldsofmistria.wiki.gg/images/3/35/Lemon.png?2a68b2',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 14,
      regrowthTime: 3,
      seedPrice: 400,
      sellPrice: 45,
      donateable: false,
      museumSet: 'None',
      forageLocation: null,
      type: ['tree'],
    },
    {
      id: 'cucumber',
      name: 'Cucumber',
      image: 'https://fieldsofmistria.wiki.gg/images/5/59/Cucumber.png?ac8b1c',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 4,
      regrowthTime: 0,
      seedPrice: 25,
      sellPrice: 40,
      donateable: true,
      museumSet: 'Summer Crop',
      forageLocation: null,
      type: ['single'],
    },
    {
      id: 'chili-pepper',
      name: 'Chili Pepper',
      image:
        'https://fieldsofmistria.wiki.gg/images/6/60/Chili_pepper.png?ebfc25',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 6,
      regrowthTime: 0,
      seedPrice: 40,
      sellPrice: 75,
      donateable: true,
      museumSet: 'Summer Crop',
      forageLocation: null,
      type: ['single'],
    },
    {
      id: 'sugar-cane',
      name: 'Sugar Cane',
      image:
        'https://fieldsofmistria.wiki.gg/images/e/e8/Sugar_cane.png?6166d2',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 6,
      regrowthTime: 0,
      seedPrice: 40,
      sellPrice: 80,
      donateable: false,
      museumSet: 'None',
      forageLocation: null,
      type: ['single'],
    },
    {
      id: 'sunflower',
      name: 'Sunflower',
      image: 'https://fieldsofmistria.wiki.gg/images/8/81/Sunflower.png?533e2d',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 6,
      regrowthTime: 0,
      seedPrice: 20,
      sellPrice: 30,
      donateable: false,
      museumSet: 'None',
      forageLocation: null,
      type: ['single'],
    },
    {
      id: 'watermelon',
      name: 'Watermelon',
      image:
        'https://fieldsofmistria.wiki.gg/images/0/06/Watermelon.png?467527',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 9,
      regrowthTime: 0,
      seedPrice: 70,
      sellPrice: 180,
      donateable: true,
      museumSet: 'Summer Crop',
      forageLocation: null,
      type: ['single'],
    },
    {
      id: 'corn',
      name: 'Corn',
      image: 'https://fieldsofmistria.wiki.gg/images/f/f8/Corn.png?a10db5',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 5,
      regrowthTime: 3,
      seedPrice: 300,
      sellPrice: 125,
      donateable: true,
      museumSet: 'Summer Crop',
      forageLocation: null,
      type: ['multi'],
    },
    {
      id: 'tomato',
      name: 'Tomato',
      image: 'https://fieldsofmistria.wiki.gg/images/9/9d/Tomato.png?a3f9b3',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 5,
      regrowthTime: 3,
      seedPrice: 300,
      sellPrice: 125,
      donateable: true,
      museumSet: 'Summer Crop',
      forageLocation: null,
      type: ['multi'],
    },
    {
      id: 'tea',
      name: 'Tea',
      image: 'https://fieldsofmistria.wiki.gg/images/5/59/Tea.png?892509',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 5,
      regrowthTime: 3,
      seedPrice: 300,
      sellPrice: 135,
      donateable: false,
      museumSet: 'None',
      forageLocation: null,
      type: ['multi'],
    },
    {
      id: 'peach',
      name: 'Peach',
      image: 'https://fieldsofmistria.wiki.gg/images/e/e2/Peach.png?7a168e',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 14,
      regrowthTime: 3,
      seedPrice: 400,
      sellPrice: 45,
      donateable: false,
      museumSet: 'None',
      forageLocation: null,
      type: ['tree'],
    },
    {
      id: 'night-queen',
      name: 'Night Queen',
      image:
        'https://fieldsofmistria.wiki.gg/images/2/2d/Night_queen.png?616cd3',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 6,
      regrowthTime: 0,
      seedPrice: 0,
      sellPrice: 40,
      donateable: false,
      museumSet: 'None',
      forageLocation: null,
      type: ['single', 'foragable'],
    },
  ];

  // Define columns for the data table
  const columns: Column<Crop>[] = [
    {
      header: 'Image',
      accessor: (row: Crop) =>
        row.image ? (
          <Image
            src={row.image}
            alt={row.name}
            className="w-6 h-6 object-cover rounded"
            width={22}
            height={22}
          />
        ) : (
          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            No img
          </div>
        ),
      width: 60,
      align: 'center',
    },
    {
      header: 'Name',
      accessor: 'name',
      width: 120,
      sortable: true,
    },

    {
      header: 'Season',
      accessor: (row: Crop) => row.season.join(', '),
      width: 100,
    },
    {
      header: 'Seed Price',
      accessor: (row: Crop) =>
        row.seedPrice ? (
          <div className="flex items-end">
            <span>{row.seedPrice}g</span>
            <Image
              src="/smallIcons/coin2.webp"
              alt={row.name}
              className="w-4 h-4 mb-[2px] ml-1"
              width={20}
              height={20}
            />
          </div>
        ) : (
          <span className="text-gray-400">n/a</span>
        ),
      width: 100,
    },
    {
      header: 'Sell Price',
      // accessor: (row: Crop) => (row.sellPrice ? `${row.sellPrice}g` : '-'),
      accessor: (row: Crop) =>
        row.sellPrice ? (
          <div className="flex items-end">
            <span>{row.sellPrice}g</span>
            <Image
              src="/smallIcons/coin2.webp"
              alt={row.name}
              className="w-4 h-4 mb-[2px] ml-1"
              width={20}
              height={20}
            />
          </div>
        ) : (
          <span className="text-gray-400">n/a</span>
        ),
      width: 100,
    },
    {
      header: 'Growth',
      accessor: (row: Crop) => (row.growthTime ? `${row.growthTime} days` : '-'),
      width: 80,
    },
    {
      header: 'Regrowth',
      accessor: (row: Crop) =>
        row.regrowthTime ? `${row.regrowthTime} days` : <span className="text-gray-400">No</span>,
      width: 80,
    },
    {
      header: 'Type',
      accessor: (row: Crop) => row.type?.join(', ') || '-',
      width: 150,
    },
    {
      header: 'Donatable',
      accessor: (row: Crop) => (
        <span className={row.donateable ? 'text-green-600' : 'text-red-400'}>
          {row.donateable ? (
            <IconCheck className="w-6 h-6 rounded-md bg-green-100 p-1" />
          ) : (
            <IconX className="w-6 h-6 rounded-md bg-red-100 p-1" />
          )}
        </span>
      ),
      width: 60,
    },
  ];

  // Stats blocks
  const stats: StatBlock[] = [
    { title: 'Total Crops', value: cropsData.length },
  ];

  // Actions for each row
  const renderActions = (row: Crop) => (
    <div className="flex gap-2 p-1">
      <button
        onClick={() => console.log('Edit', row.id)}
        className="p-1 text-mm-blue-mid hover:bg-blue-50 rounded"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={() => console.log('View', row.id)}
        className="p-1 text-mm-orange-dark hover:bg-mm-orange-dark/10 rounded"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => console.log('Delete', row.id)}
        className="p-1 text-mm-pink-75 hover:bg-red-50 rounded"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  // Filters
  const [filters, setFilters] = useState({
    name: '',
    season: '',
    donatableFilter: '',
    typeFilter: '',
  });

  const filterConfigs: FilterConfig[] = [
    {
      id: 'nameFilter',
      label: 'Name',
      type: 'text',
      placeholder: 'Search by crop name',
      className: 'focus:ring-mm-orange-dark',
      value: filters.name,
      onChange: (value) =>
        setFilters((prev) => ({
          ...prev,
          name: String(value ?? ''),
        })),
      icon: <IconSearch size={16} />,
    },
    {
      id: 'seasonFilter',
      label: 'Season',
      type: 'dropdown',
      className: 'focus:ring-mm-orange-dark',
      value: filters.season,
      onChange: (value) =>
        setFilters((prev) => ({
          ...prev,
          season: String(value ?? ''),
        })),
      options: [
        { value: 'all', label: 'All Seasons' },
        { value: 'spring', label: 'Spring' },
        { value: 'summer', label: 'Summer' },
        { value: 'fall', label: 'Fall' },
        { value: 'winter', label: 'Winter' },
      ],
    },
    {
      id: 'donatableFilter',
      label: 'Donatable',
      type: 'dropdown',
      className: 'focus:ring-mm-orange-dark',
      value: filters.donatableFilter,
      onChange: (value) =>
        setFilters((prev) => ({
          ...prev,
          donatableFilter: String(value ?? ''),
        })),
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ],
    },
    {
      id: 'typeFilter',
      label: 'Type',
      type: 'dropdown',
      className: 'focus:ring-mm-orange-dark',
      value: filters.typeFilter,
      onChange: (value) =>
        setFilters((prev) => ({
          ...prev,
          typeFilter: String(value ?? ''),
        })),
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'single', label: 'Single' },
        { value: 'multi', label: 'Multi' },
        { value: 'forageable', label: 'Forageable' },
      ],
    },
  ];

  return (
    <div className="CropsPage w-full">
      <div className="flex flex-col gap-2 w-full">
        {/* The Left hand Side */}
        <div className="flex items-center justify-between w-full">
          <h1 className="text-4xl font-semibold text-slate-700">🌾 Crops</h1>
          <button
            type="button"
            className="rounded-md bg-mm-orange-dark-mid transition duration-300 ease-in-out flex items-center gap-1 px-3 py-2 text-sm font-medium hover:bg-mm-orange-dark hover:shadow-sm"
          >
            <IconPlus className="stroke-[2] w-5 h-5" />
            <span className="font-bold">Add New Crop</span>
          </button>
        </div>

        {/* Description */}
        <p className="text-neutral-500 mt-3 mb-5">
          Table containing all crop and forageable item data including planting
          seasons, growth times, pricing, and sourcing information from Fields
          of Mistria.
        </p>
      </div>

      <hr className="border-slate-300 my-5" />

      <DataTableFilters filters={filterConfigs} columns={4} />

      <DataTable
        ref={tableRef}
        data={cropsData}
        columns={columns}
        wFull
        sortable={false}
        actions={renderActions}
        selectable={true}
        selectableBgColor="bg-orange-50"
        stats={stats}
        showStats={true}
        itemsPerPage={10}
        itemsPerPageOptions={[5, 10, 15, 20, 25, 50]}
        clickable={{
          href: (row) => `/admin/crops/${row.id}`,
          target: '_self',
        }}
        onRowSelect={(selected) => {
          console.log('Selected rows:', selected);
        }}
        onRowClick={(row) => {
          console.log('Row clicked:', row);
        }}
      />
    </div>
  );
}
