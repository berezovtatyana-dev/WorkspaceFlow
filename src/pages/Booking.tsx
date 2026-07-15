import React, {useState, useMemo} from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { mockResources, Resource } from "../mockData/mockData";
import { ResourceCard } from "../components/ResourceCard";
import { BookingFilters } from "../components/BookingFilters";
import { SkeletonCard } from "../components/SkeletonCard";

export const Booking: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        search: '',
        date: new Date().toISOString().split('T')[0],
        type: 'all' as 'all' |'desk' | 'room',
        floor: 'all' as 'all' | number,
        hasTypeC: false,
        hasFlipchart: false        
    });

    const {data: resources, loading, error} = useFetch<Resource>(
        ()=>mockResources,
        [filters.date, filters.type]
    );

    const filteredResources = useMemo(()=>{
        if(!resources) return [];
        return resources.filter(res => {
            const matchesSearch = res.name.toLowerCase().includes(filters.search.toLowerCase());
            const matchesType = filters.type === 'all' || res.type === filters.type;
            const matchesFloor = filters.floor === 'all' || res.floor === filters.floor;
            const matchesFlipchart = !filters.hasFlipchart || res.features.includes('Флипчарт');
            const matchesTypeC = !filters.hasTypeC || res.features.includes('Type-C Монитор');
            return matchesSearch && matchesType && matchesFloor && matchesFlipchart && matchesTypeC;
        });
    }, [resources, filters]);
    const handleSelectResource = (id: string) => {
        navigate(`/resource/${id}`);
    };



    const [shouldCrash, setShouldCrash] = useState(false);
        if(shouldCrash) {
            throw new Error('Симуляция сбоя');
        }
    return(
        <div className='container'>
            <div>
                <h1>Рабочее пространство</h1>
                <button onClick={()=> setShouldCrash(true)}>Тест сбоя</button>
            </div>
            <BookingFilters filters={filters} setFilters={setFilters} />
            {error && (<div>{error}</div>)}
            {loading ? (<SkeletonCard />) : (
                <div>
                    <div>Найдено: {filteredResources.length}</div>
                    {filteredResources.length === 0? (
                        <div>По запросу ничего не найдено</div>
                    ):(
                        <div>
                            {filteredResources.map(resource => (
                                <ResourceCard
                                key={resource.id}
                                resource={resource}
                                onSelectResource={handleSelectResource}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};