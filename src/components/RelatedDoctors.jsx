import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId }) => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    const relDoc = doctors.filter(
        (doc) => doc.speciality === speciality && String(doc.id ?? doc._id) !== docId
    )

    return (
        <div className='my-12 flex flex-col gap-4 text-[#1f1f1f]'>

            <div className="relative text-center">
                <h1 className='text-3xl font-bold'>More in this speciality</h1>

                {/* underline */}
                <div className="mx-auto mt-2 h-0.5 w-[60px] rounded-full bg-[#46a300]" />
            </div>

            <p className='text-sm text-[#4b5563]'>
                Explore more specialists in this category.
            </p>

            <div className='grid w-full grid-cols-1 gap-4 pt-3 sm:grid-cols-2 lg:grid-cols-3'>
                {relDoc.map((item) => (
                    <button
                        type="button"
                        key={item.id ?? item._id}
                        onClick={() => {
                            navigate(`/appointment/${item.id ?? item._id}`)
                            scrollTo(0, 0)
                        }}
                        className='group flex min-h-28 w-full items-center gap-4 rounded-lg border border-[#dfe8d9] bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#dfe8d9] hover:shadow-lg'
                    >
                        {item.image ? (
                            <img
                                src={item.image}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="h-16 w-16 shrink-0 rounded-full object-cover"
                            />
                        ) : (
                            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#f3f4f6] text-xl font-semibold text-[#46a300]" aria-hidden="true">
                                {item.name?.charAt(0) || '?'}
                            </span>
                        )}
                        <div>
                            <div
                                className={`flex items-center gap-2 text-sm ${
                                    item.available ? 'text-emerald-700' : 'text-[#6b7280]'
                                }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        item.available ? 'bg-emerald-500' : 'bg-[#9ca3af]'
                                    }`}
                                />
                                <p>{item.available ? 'Available' : 'Not Available'}</p>
                            </div>

                            <p className='mt-3 text-xl font-bold text-[#1f1f1f] group-hover:text-[#46a300]'>
                                {item.name}
                            </p>

                            <p className='text-sm text-[#4b5563]'>
                                {item.speciality}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

RelatedDoctors.propTypes = {
    speciality: PropTypes.string.isRequired,
    docId: PropTypes.string.isRequired
}

export default RelatedDoctors
