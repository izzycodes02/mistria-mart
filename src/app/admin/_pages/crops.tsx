'use client';

import { Column, DataTable, DataTableRef, StatBlock } from '@/components/ui/common/Datatable';
import { IconPlus } from '@tabler/icons-react';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

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
      id: 'crop_001',
      name: 'Tomato',
      image: '/images/crops/tomato.png',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 5,
      regrowthTime: 0,
      seedPrice: 20,
      sellPrice: 35,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Fruit'],
    },
    {
      id: 'crop_002',
      name: 'Carrot',
      image: '/images/crops/carrot.png',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 4,
      regrowthTime: 0,
      seedPrice: 15,
      sellPrice: 25,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable'],
    },
    {
      id: 'crop_003',
      name: 'Pumpkin',
      image: '/images/crops/pumpkin.png',
      season: ['Fall'],
      source: 'General Store',
      growthTime: 7,
      regrowthTime: 0,
      seedPrice: 30,
      sellPrice: 50,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable'],
    },
    {
      id: 'crop_004',
      name: 'Potato',
      image: '/images/crops/potato.png',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 6,
      regrowthTime: 0,
      seedPrice: 25,
      sellPrice: 40,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable'],
    },
    {
      id: 'crop_005',
      name: 'Corn',
      image: '/images/crops/corn.png',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 8,
      regrowthTime: 0,
      seedPrice: 25,
      sellPrice: 45,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Grain'],
    },
    {
      id: 'crop_006',
      name: 'Strawberry',
      image: '/images/crops/strawberry.png',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 4,
      regrowthTime: 3,
      seedPrice: 40,
      sellPrice: 60,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Fruit'],
    },
    {
      id: 'crop_007',
      name: 'Cucumber',
      image: '/images/crops/cucumber.png',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 5,
      regrowthTime: 0,
      seedPrice: 25,
      sellPrice: 40,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable'],
    },
    {
      id: 'crop_008',
      name: 'Broccoli',
      image: '/images/crops/broccoli.png',
      season: ['Fall'],
      source: 'General Store',
      growthTime: 7,
      regrowthTime: 0,
      seedPrice: 35,
      sellPrice: 55,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable'],
    },
    {
      id: 'crop_009',
      name: 'Lettuce',
      image: '/images/crops/lettuce.png',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 3,
      regrowthTime: 0,
      seedPrice: 15,
      sellPrice: 25,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Leafy'],
    },
    {
      id: 'crop_010',
      name: 'Bell Pepper',
      image: '/images/crops/pepper.png',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 6,
      regrowthTime: 3,
      seedPrice: 30,
      sellPrice: 45,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable'],
    },
    {
      id: 'crop_011',
      name: 'Cauliflower',
      image: '/images/crops/cauliflower.png',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 6,
      regrowthTime: 0,
      seedPrice: 35,
      sellPrice: 60,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable'],
    },
    {
      id: 'crop_012',
      name: 'Eggplant',
      image: '/images/crops/eggplant.png',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 6,
      regrowthTime: 3,
      seedPrice: 30,
      sellPrice: 50,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable'],
    },
    {
      id: 'crop_013',
      name: 'Peas',
      image: '/images/crops/peas.png',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 4,
      regrowthTime: 3,
      seedPrice: 30,
      sellPrice: 45,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Legume'],
    },
    {
      id: 'crop_014',
      name: 'Radish',
      image: '/images/crops/radish.png',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 3,
      regrowthTime: 0,
      seedPrice: 20,
      sellPrice: 30,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Root'],
    },
    {
      id: 'crop_015',
      name: 'Spinach',
      image: '/images/crops/spinach.png',
      season: ['Fall'],
      source: 'General Store',
      growthTime: 3,
      regrowthTime: 0,
      seedPrice: 20,
      sellPrice: 35,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Leafy'],
    },
    {
      id: 'crop_016',
      name: 'Onion',
      image: '/images/crops/onion.png',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 7,
      regrowthTime: 0,
      seedPrice: 25,
      sellPrice: 40,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Bulb'],
    },
    {
      id: 'crop_017',
      name: 'Garlic',
      image: '/images/crops/garlic.png',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 8,
      regrowthTime: 0,
      seedPrice: 30,
      sellPrice: 50,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Bulb'],
    },
    {
      id: 'crop_018',
      name: 'Watermelon',
      image: '/images/crops/watermelon.png',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 10,
      regrowthTime: 0,
      seedPrice: 50,
      sellPrice: 100,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Fruit'],
    },
    {
      id: 'crop_019',
      name: 'Zucchini',
      image: '/images/crops/zucchini.png',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 5,
      regrowthTime: 3,
      seedPrice: 25,
      sellPrice: 40,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Squash'],
    },
    {
      id: 'crop_020',
      name: 'Kale',
      image: '/images/crops/kale.png',
      season: ['Fall'],
      source: 'General Store',
      growthTime: 4,
      regrowthTime: 0,
      seedPrice: 25,
      sellPrice: 40,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Leafy'],
    },
    {
      id: 'crop_021',
      name: 'Beets',
      image: '/images/crops/beets.png',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 5,
      regrowthTime: 0,
      seedPrice: 25,
      sellPrice: 40,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Root'],
    },
    {
      id: 'crop_022',
      name: 'Celery',
      image: '/images/crops/celery.png',
      season: ['Fall'],
      source: 'General Store',
      growthTime: 7,
      regrowthTime: 0,
      seedPrice: 25,
      sellPrice: 45,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable'],
    },
    {
      id: 'crop_023',
      name: 'Cabbage',
      image: '/images/crops/cabbage.png',
      season: ['Spring'],
      source: 'General Store',
      growthTime: 6,
      regrowthTime: 0,
      seedPrice: 30,
      sellPrice: 50,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Leafy'],
    },
    {
      id: 'crop_024',
      name: 'Sweet Potato',
      image: '/images/crops/sweet_potato.png',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 9,
      regrowthTime: 0,
      seedPrice: 35,
      sellPrice: 60,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Root'],
    },
    {
      id: 'crop_025',
      name: 'Green Bean',
      image: '/images/crops/green_bean.png',
      season: ['Summer'],
      source: 'General Store',
      growthTime: 5,
      regrowthTime: 3,
      seedPrice: 30,
      sellPrice: 45,
      donateable: true,
      museumSet: 'Crops',
      forageLocation: null,
      type: ['Vegetable', 'Legume'],
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
            className="w-8 h-8 object-cover rounded"
            width={32}
            height={32}
          />
        ) : (
          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            No img
          </div>
        ),
      width: 80,
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
      sortable: true,
    },
    {
      header: 'Seed Price',
      accessor: (row: Crop) => (row.seedPrice ? `${row.seedPrice}g` : '-'),
      width: 100,
      sortable: true,
    },
    {
      header: 'Sell Price',
      accessor: (row: Crop) => (row.sellPrice ? `${row.sellPrice}g` : '-'),
      width: 100,
      sortable: true,
    },
    {
      header: 'Growth',
      accessor: (row: Crop) => (row.growthTime ? `${row.growthTime}d` : '-'),
      width: 80,
      sortable: true,
      align: 'center',
    },
    {
      header: 'Regrowth',
      accessor: (row: Crop) =>
        row.regrowthTime ? `${row.regrowthTime}d` : 'No',
      width: 80,
      sortable: true,
      align: 'center',
    },
    {
      header: 'Type',
      accessor: (row: Crop) => row.type?.join(', ') || '-',
      width: 150,
    },
    {
      header: 'Donatable',
      accessor: (row: Crop) => (
        <span className={row.donateable ? 'text-green-600' : 'text-gray-400'}>
          {row.donateable ? '✓' : '✗'}
        </span>
      ),
      width: 80,
      align: 'center',
    },
  ];

  // Stats blocks
  const stats: StatBlock[] = [
    { title: 'Total Crops', value: cropsData.length },
    {
      title: 'Avg Seed Price',
      value: `${Math.round(cropsData.reduce((acc, c) => acc + (c.seedPrice || 0), 0) / cropsData.length)}g`,
    },
    {
      title: 'Avg Sell Price',
      value: `${Math.round(cropsData.reduce((acc, c) => acc + (c.sellPrice || 0), 0) / cropsData.length)}g`,
    },
    {
      title: 'Regrowable',
      value: cropsData.filter((c) => (c.regrowthTime || 0) > 0).length,
    },
  ];

  // Actions for each row
  const renderActions = (row: Crop) => (
    <div className="flex gap-2">
      <button
        onClick={() => console.log('Edit', row.id)}
        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={() => console.log('Delete', row.id)}
        className="p-1 text-red-600 hover:bg-red-50 rounded"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

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
        <p className="text-neutral-500 mt-3">
          Table containing all crop and forageable item data including planting
          seasons, growth times, pricing, and sourcing information from Fields
          of Mistria.
        </p>
      </div>

      <DataTable
        ref={tableRef}
        data={cropsData}
        columns={columns}
        wFull
        sortable={true}
        actions={renderActions}
        selectable={false}
        stats={stats}
        showStats={true}
        itemsPerPage={10}
        itemsPerPageOptions={[5, 10, 25, 50]}
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
